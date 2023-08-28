import { query } from "express";
import db from "../models/index";
import {
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
} from "../services/DoctorHomepageServices";
class doctorController {
  async getDoctorHomePageLimit(req, res) {
    //sử dụng limit trong sql synTax
    let limit = req.query.limit;
    if (!limit) {
      limit = 10;
    }
    try {
      let response = await handleGetDoctorHomePageLimit(+limit);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(200).json({
        errCode: -1,
        message: "Error from sever",
      });
    }
  }

  async getAllDoctor(req, res) {
    try {
      let response = await handleGetAllDoctor();
      res.status(200).json(response);
    } catch (error) {
      res.status(200).json({
        errCode: -1,
        message: "Error form sever",
      });
    }
  }

  async createDoctorDesc(req,res) {
    try {
      let response = await handleCreateDotorDesc(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(200).json({
        errCode: 1,
        message: "Error from sever",
      });
    }
  }

  async getDetailDoctorDesc(req, res) {
    try {
      let dataResponse = await handleGetDetailDoctor(req.query.id);
      return res.status(200).json(dataResponse);
    } catch (error) {
      return res.status(200).json({
        errCode: -1,
        message: "Error from server",
      });
    }
  }

  async BulkCreateDoctorTime(req,res) {
    try {
        let response =await handleBulkCreateDoctor(req.body);
        return res.status(200).json(response);
    } catch (error) {
      return res.status(200).json({
        errCode : 1,
        message: 'Missing parameter !!!' 
      });
    }
  }

  async getTimeStampDoctorSchedules(req,res) {
    try {
      let response = await handleTimeStampDoctorSchedules(req.query.date,req.query.doctorId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(200).json({
        errCode : 1,
        message : 'Error From Server'
      });
    }
  }

  async getDoctorInfoSchedules(req,res) {
    try {
      let response = await handleDoctorInfoShedules(req.query.doctorId);  
      return res.status(200).json(response);
    } catch (error) {
      return res.status(200).json({
        errCode : 2,  
        message: "Error from server"
      })
    }
  }

  async getTimeBookingDoctorSchedule(req,res) {
      try {
        let response = await handleGetTimeBookingScheduleDoc(req.query.keyMap);
        return res.status(200).json(response);
      } catch (error) {
        return res.status(500).json({
          errCode : 1,
          message :"Error from server"
        })
      }
  }

  async PostBookingDoctorSchedules(req,res) {
     try {
      let response = await handlePostBookingPatientSchedules(req.body);
      return res.status(200).json(response);
     } catch (error) {
      return res.status(200).json({
        errCode : -1,
        message :"Error from server"
      });
     }
  }

  async PostVertifyBookingDoctor(req,res) {
    try {
      let response = await hanldePostVertifyBooking(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({
        errCode: -1,
        message : 'Error from Server'
      })
    }
  }

  async PostSaveManagerDoctorAppointments(req,res) {
    try {
      let response = await handlePostSaveManagerDoctorAppointments(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(200).json({
        errCode : -1,
        message :'Error from Server'
      });
    }
  }

  async GetDoctorSpecialtyAppointments(req,res) {
    try {
      let response = await handleGetDoctorSpecialtyAppointments(req.query.id);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(200).json({
        errCode : -1,
        message : 'ERROR FROM SERVER'
      });
    }
  }

  async GetInfoDoctorSpecialtyIdAppointments(req,res) {
    try {
      let response = await handleGetInfoDoctorSpecialtyId(req.query.specialtyId,req.query.provinceId)
      return res.status(200).json(response);
    } catch (error) {
      return res.status(200).json({
        errCode : -1,
        message :"Error From Server"
      });
    }
  }

  async PostClinicManagerDoctor(req,res) {
    try {
      let response = await handlePostClinicManagerDoctor(req.body);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(200).json({
        errCode : -1,
        message : 'Error from server'
      });
    }
  }

  async getDataClinicDoctor(req,res) {
    try {
      let response = await handleGetAllClinic();
      return res.status(200).json(response);
    } catch (error) {
      return res.status(200).json({
        errCode : -1,
        message : "Error from server"
      });
    }
  }

  async GetDoctorClinicDoctor(req,res) {
    try {
      let response = await handleGetDoctorClinicID(req.query.clinicId);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(200).json({
        errCode : -1,
        message : "Error from server"
      })
    }
  }

  async GetdataListPatient(req,res) {
    try {
      let response = await handleGetDataPatientList(req.query.doctorId,req.query.date);
      return res.status(200).json(response);
    } catch (error) {
      return res.status(200).json({
        errCode : -1,
        message : "Error from server"
      })
    }
  }

  async SendRemedyPatient(req,res) {
    try {
      let response = await handlePostRemedyPatient(req.body);
      return  res.status(200).json(response);
    } catch (error) {
      return res.status(200).json({
        errCode : -2,
        message : "ERROR FROM SERVER"
      })
    }
  }
}

module.exports = new doctorController();
