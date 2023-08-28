import { raw } from "body-parser";
import db from "../models/index";
import { v4 as uuidv4 } from 'uuid';
import _, { reject, result }  from "lodash";
import EmailServices  from './EmailServices';
require('dotenv').config();
// Build Token Vertify Booking Schedules
let buildEmailToken = (doctorId,token) => {
    let results = `${process.env.REACT_ENV}/vertify-booking-schedules?token=${token}&doctorId=${doctorId}`;
    return results;
}
const MAX_NUMBER_SCHEDULES = process.env.MAX_NUMBER_SCHEDULES;
let handleGetDoctorHomePageLimit = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let dataResponse = await db.User.findAll({
        limit: limitInput,
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "postisionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        nest: true,
        raw: true,
      });
      resolve({
        errCode: 0,
        dataResponse,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let handleGetAllDoctor = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });

      resolve({
        errCode: 0,
        data: data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let handleCreateDotorDesc = (data) => {
  return new Promise(async(resolve, reject) => {
    try {
      if (!data.doctorId || !data.contentHTML || !data.contentMarkdown || !data.price ||
           !data.payment || !data.province || !data.Clinic || !data.addressClinic || !data.specialtyId)
      {
        resolve({
          errCode: 2,
          message: "Missing parameter ...!!!",
        });
      }
      else {
        if (data.action === "CREATE") {
           await db.Markdown.create({
            contentHTML: data.contentHTML,
            contentMarkdown: data.contentMarkdown,
            description: data.description,
            doctorId: data.doctorId,
          });
        }
        else if (data.action === "UPDATE") {
          let findUser = await db.Markdown.findOne({
            where: { doctorId: data.doctorId },
            raw:false
          });
          if (findUser) {
            findUser.contentHTML = data.contentHTML;
            findUser.contentMarkdown = data.contentMarkdown;
            findUser.description = data.description;
            await findUser.save();
          }
        }
          let DataValue = await db.doctor_info.findOne({
            where : {doctorId : data.doctorId},
            raw: false
          })
          if(DataValue) {
            DataValue.priceId = data.price;
            DataValue.provinceId = data.province;
            DataValue.paymentsId = data.payment;
            DataValue.addressClinic = data.addressClinic;
            DataValue.nameClinic = data.Clinic;
            DataValue.note = data.Note;
            DataValue.specialtyId = data.specialtyId
            DataValue.clinicId	= data.clinicId	
            await DataValue.save();
          }
          else {
            await db.doctor_info.create({
              doctorId : data.doctorId,
              priceId : data.price,
              provinceId : data.province,
              paymentsId : data.payment,
              addressClinic : data.addressClinic,
              nameClinic : data.Clinic,
              note : data.Note,
              specialtyId :data.specialtyId,
              clinicId	: data.clinicId	
            })
          }
          resolve({
            errCode: 0,
            message : 'SuccessFully Connected'
          });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let handleGetDetailDoctor = (dataId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!dataId) {
        resolve({
          errCode: 1,
          message: "Missing parameter id !!!",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: dataId },  
          attributes: {
            exclude: ["password"],  
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["contentHTML", "contentMarkdown", "description"],
            },
            {
              model: db.Allcode,
              as: "postisionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.doctor_info,  
              attributes :{
                exclude:['id']
              },
              include : [
                {
                  model: db.Allcode,
                  as : 'PriceData',
                  attributes :['valueVi','valueEn']
                },
                {
                  model: db.Allcode,
                  as : 'ProvinceIdData',
                  attributes :['valueVi','valueEn']
                },
                {
                  model: db.Allcode,
                  as : 'PaymentsIdData',
                  attributes :['valueVi','valueEn']
                }
              ]
            }
          ],
          nest: true,
          raw: true,
        });
        if (data && data.image) {
          data.image = Buffer.from(data.image, "base64").toString("binary");
        }
        resolve({ errCode: 0, data: data });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let handleBulkCreateDoctor = (data) =>{
  return new Promise(async(resolve, reject) => {
         try {
          if(!data.results || !data.date || !data.doctorId) {
            resolve({
              errCode : 1,
              message : "Missing parameters !!!!"
            })
          }
          else {
            let schedule = data.results;
            if(schedule && schedule.length > 0) {
              schedule = schedule.map(item => {
                item.maxNumber = MAX_NUMBER_SCHEDULES;
                return item;
              })
            }
            
            let exists = await db.Schedule.findAll({
              where : {
                date : data.date,
                doctorId : data.doctorId
              },
              attributes: ['date','doctorId','timeType','maxNumber'],
            })

            if(exists && exists.length > 0) {
              exists = exists.map(item => {
                item.date = data.date;
                return item;
              })
            }
            
            let toCreate = _.differenceWith(schedule,exists , (a, b) => {
              return a.timeType === b.timeType && a.date === b.date;
            })


            // hàm add nhiều các bluk lịch khám
            await db.Schedule.bulkCreate(toCreate);
            resolve({
              errCode : 0,
              message : 'Successfully !!!'
            })
          }
         
         } catch (error) {
          reject(error);  
         }
  })
}

let handleTimeStampDoctorSchedules = (date,doctorId) => {
  return new Promise(async(resolve, reject) => {
    try {
         if(!date || !doctorId) {
          resolve({
            errCode : 2,
            message : 'Missing parameter required'
          })
         }
         else {
          let response = await db.Schedule.findAll({
            where : {doctorId : doctorId , date : date },
            include :[
              {
                model: db.Allcode,
                as: "TimeData",
                attributes: ["valueEn", "valueVi"],
              },
            ],
            nest: true, 
            raw: true
          })        
            resolve({
              errCode : 0,
              data : response
            })
          

         }
      
    } catch (error) {
       reject(error);
    }
  })
}

let handleDoctorInfoShedules = (inputId) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!inputId) {
        resolve({
          errCode : 1,
          message :'Missing parameter'
        })
      }
      else {
        let dataValue = await db.doctor_info.findOne({
             where : {doctorId : inputId},
          include :[
            {
              model: db.Allcode,
              as : 'PriceData',
              attributes :['valueVi','valueEn']
            },
            {
              model: db.Allcode,
              as : 'ProvinceIdData',
              attributes :['valueVi','valueEn']
            },
            {
              model: db.Allcode,
              as : 'PaymentsIdData',
              attributes :['valueVi','valueEn']
            },
            
          ],
          raw:false,
          nest: true
        })
       
          resolve({
            errCode : 0,
            data : dataValue
          })
       
        

      }
      
    } catch (error) {
      
    }
  })
}

let handleGetTimeBookingScheduleDoc =(type) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!type) {
        resolve({
          errCode : -1,
          message : "Missing parameter type"
        })
      }
      else {
        let response = await db.Allcode.findOne({
          where : {keyMap : type}
        })
        if(response) {
          resolve({
            errCode : 0,
            data : response
          })
        }
      }
    } catch (error) {
      reject(error);
    }
  })
}

let handlePostBookingPatientSchedules =(data) => {
   return new Promise(async(resolve, reject) => {
    try {
      if(!data.email || !data.fullName|| !data.phoneNumber) {
        resolve({
          errCode:-2,
          message :"Missing parameter "
        })
      } 
      else {
        let token = uuidv4();
        await EmailServices.sendEmailBooking({
          email: data.email,
          doctorName : data.doctorName,
          time : data.TimeEmail,
          language : data.language,
          redirectLink :buildEmailToken(data.doctorId,token)
        });

        let user = await db.User.findOrCreate({
            where: { email: data.email },
            defaults: {
             email : data.email,
             roleId:'R3',
             firstName : data.fullName,
             address : data.address,
             phoneNumber : data.phoneNumber,
             gender : data.gender,
             dayofbirth : data.dayofbirth,
             image : '',
             lastName : ''
            }, 
          });
        if(user) {          
            await db.Booking.findOrCreate({
              where: { patientId: user[0].id },
              defaults : {
                statusId: 'S1',
                doctorId: data.doctorId,
                date: data.date,
                patientId: user[0].id,
                timeType: data.timeType,
                token :token
              }
          })
          resolve({
            errCode : 0,
            message : 'Create Booking Schedules Successfully'
          })
        }
      }
    } catch (error) {
      reject(error);
    }
   })
}

let hanldePostVertifyBooking = (data) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!data.doctorId || !data.token) {
        resolve({
          errCode : -2,
          message :"Missing parameter"
        })
      }
      else {
        let appointment = await db.Booking.findOne({
          where : {
            statusId : 'S1',
            doctorId : data.doctorId,
            token : data.token
          },
          raw:false
        })

        if(appointment) {
          appointment.statusId ='S2';
          await appointment.save();
        }
        resolve({
            errCode : 0,
            message : 'Vertify Booking Schedules Successfully'
        })
      }
    } catch (error) {
      
    }
  })
}

let handlePostSaveManagerDoctorAppointments = (data) => {
    return new Promise(async(resolve,reject) => {
      try {
       if(!data.image || !data.markdownHTML ||  !data.name) {
          resolve({
            errCode : 1,
            message :"Missing parameter"
          })
       }
       else {
          await db.Specialty.create({
          name : data.name,
          image  : data.image,
          previewImageSlider : data.previewImageSlider,
          markdownHTML  : data.markdownHTML,
          markdownContent	  : data.markdownContent
         })     
            resolve({
              errCode : 0,
              message : 'Successfully to Save Specialty Doctor Appoinments'
            })
        
       }
      } catch (error) {
        
      }
    })
}

let handleGetDoctorSpecialtyAppointments =(id) => {
   return new Promise(async(resolve, reject) => {
    try {
      if(!id) {
        resolve({
          errCode : -2,
          message :"Missing parameter"
        })
      }
      else {
        if(id === 'All') {
          let specialty = await db.Specialty.findAll({
          });
          if(specialty && specialty.map(item => {
            item.image =  Buffer.from(item.image,"base64" ).toString("binary");
            return item;
          })) 
          
          resolve({
            data: specialty,
            errCode : 0,
            message : 'Successfully Get Data Specialty Doctor ALL'
          })   
        }
        else {
          let SingleSpecialtys = await db.Specialty.findOne({
            where :{id  : id}
          })
          if(SingleSpecialtys) {
             
          resolve({
            data: SingleSpecialtys,
            errCode : 0,
            message : 'Successfully Get Data Specialty Doctor SINGLE'
          })   
          }
        }
      }
    } catch (error) {
      reject(error);
    }
   })
}

let handleGetInfoDoctorSpecialtyId =(SpecialtyID,provinceId) => {
      return new Promise(async(resolve, reject) => {
        try {
           if(!SpecialtyID) {
            resolve({
              errCode : -2,
              message : "Missing parameter"
            })
           }
           else {
            if(provinceId === 'All') {
              let FindSpecialty = await db.doctor_info.findAll({
                where :{specialtyId : SpecialtyID},
               
              })
              if(FindSpecialty && FindSpecialty.length > 0) {
                resolve({
                  data : FindSpecialty,
                  errCode : 0,
                  message : "Successfully found"
                })
              }
            }
            else {
              let FindSpecialty = await db.doctor_info.findAll({
                where :{
                  specialtyId : SpecialtyID,
                  provinceId : provinceId
                },
              })
              if(FindSpecialty) {
                resolve({
                  data : FindSpecialty,
                  errCode : 0,
                  message : "Successfully found"
                })
              }
              else {
                resolve({
                  errCode : -2,
                  message :"Fail"
                })
              }
            }
           }
        } catch (error) {
           reject(error);
        }
      })
}

let handlePostClinicManagerDoctor = (data) => {
  console.log(data);
  return new Promise(async(resolve, reject) => {
    try {
      if(!data.markdownContent || !data.ClinicName || !data.imagebase64 || !data.address) {
        resolve({
          errCode : -2,
          message : 'Missing parameter'
        })
      }
      else {
        await db.Clinic.create({
            name : data.ClinicName,
            address : data.address,
            descriptionHTML : data.markdownHTML,
            descriptionContent : data.markdownContent,
            image : data.imagebase64
        })
        resolve({
          errCode : 0,
          message :"Successfully To Create Clinics"
        })
      }
    } catch (error) {
      reject(error)
    }
  })
}

let handleGetAllClinic = () => {
  return new Promise(async(resolve, reject) => {
    try {
        let ClinicData = await db.Clinic.findAll({});
        if(ClinicData && ClinicData.map(item => {
          item.image =  Buffer.from(item.image,"base64" ).toString("binary");
          return item;
        }))      
        resolve({
          data : ClinicData,
          errCode : 0,
          message : "Successfully"
        })
    } catch (error) {
      reject(error);
    }
  })
}

let handleGetDoctorClinicID =(InputID) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!InputID) {
        resolve({
          errCode : -2,
          message : "Missing parameter required"
        })
      }
      else {
          let Clinics = await db.Clinic.findOne({
            where : {id : InputID}
          })
          if(Clinics) {
            Clinics.response = await db.doctor_info.findAll({
              where : {clinicId : InputID}
            });
            if(Clinics.response) {
              resolve({
                data : Clinics,
                errCode : 0,
                message : "Successfully"
              })
            }
          }
      }
    } catch (error) {
      reject(error);
    }
  })
}

let handleGetDataPatientList =(doctorId,date) => {
  return new Promise(async(resolve, reject) => {
    try {
      if(!doctorId || !date) {
        resolve({
          errCode : -2,
          message :"Missing parameter"
        })
      }
      else {
        let Test = await db.Booking.findAll({
          where : {
            statusId : 'S2',
            doctorId : doctorId,
            date : date,
          },
          include :[
            {
              model : db.User,as:'PatientData',
              attributes : ['firstName','phoneNumber','gender','dayofbirth','email'],
              include : [
                {
                  model : db.Allcode,as :'genderData',
                  attributes :['valueEn','valueVi']
                }
              ]
            },
            {
              model:db.Allcode,as:'Time',
              attributes :['valueEn','valueVi']
            }
          ],
          raw:false,
          nest:true,
        })
        resolve({
          Test,
          errCode : 0,
          message :"Successfully"
        })

      }
    } catch (error) {
      reject(error)
    }
  })
}

let handlePostRemedyPatient =(data) => {
  return new Promise(async(resolve,reject) => {
    try {
     if(!data.doctorId || !data.patientId || !data.timeType || !data.date) {
        resolve({
        errCode : -2,
        message :"Missing parameter"
        })
      }
     else {
        let response  = await db.Booking.findOne({
          where : {
            doctorId : data.doctorId,
            timeType : data.timeType,
            date : data.date,
            statusId : 'S2'
          },
          raw:false
        })

        if(response) {
          response.statusId ='S3';
          await response.save();
        }
        await EmailServices.sendEmailAttactments(data);
        resolve({
          errCode : 0,
          message : 'Successfully To Send Remedy'
        })
     }
    } catch (error) {
      reject(error);
    }
  })
}

module.exports = {
  handleGetDoctorHomePageLimit,
  handleGetAllDoctor,
  handleCreateDotorDesc,
  handleGetDetailDoctor,
  handleBulkCreateDoctor,
  handleTimeStampDoctorSchedules,
  handleDoctorInfoShedules,
  handleGetTimeBookingScheduleDoc,
  handlePostBookingPatientSchedules,
  hanldePostVertifyBooking,
  handlePostSaveManagerDoctorAppointments,
  handleGetDoctorSpecialtyAppointments,
  handleGetInfoDoctorSpecialtyId,
  handlePostClinicManagerDoctor,
  handleGetAllClinic,
  handleGetDoctorClinicID,
  handleGetDataPatientList,
  handlePostRemedyPatient
};
