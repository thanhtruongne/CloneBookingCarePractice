import nodemailer from "nodemailer";
require('dotenv').config();
let sendEmailBooking = async(dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_APP ,
          pass: process.env.EMAIL_PASSWORD_APP
        }
    });     
    let info = await transporter.sendMail({
        from: `"Lix EIW 👻" <${process.env.EMAIL_APP}>`, // sender address
        to: `${dataSend.email}`, // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: buildTextFormEmail(dataSend), // html body
    });
}
let buildTextFormEmail = (data) => {
 let name ='';
 if(data.language === 'vi') {
    name = `
    <h3>Dear, ${data.doctorName}</h3>
    <p>Bạn đã nhận được mail này. Xin chúc mừng</p>
    <div>Thời gian : ${data.time}</div>
    <div>
        Nếu các thông tin là đúng sự thật, vui lòng click vào đường link dưới để đặt lịch khám bệnh
    </div>
    <div>
    <a href="${data.redirectLink}">Click Here</a>
    </div>
    ` 
 }
 if(data.language === 'en') {
    name = `
    <h3>Dear, ${data.doctorName}</h3>
    <p>You have got this mail. Xin chúc mừng</p>
    <div> Date Time: ${data.time}</div>
    <div>
       If the information is correct, please click on the link below to book an appointment
    </div>
    <div>
    <a href="${data.redirectLink}">Click Here</a>
    </div>
    ` 
 }
 return name;
}

let buildTextFormEmailAttachments = (data) => {
    let name ='';
    if(data.language === 'vi') {
       name = `
       <h3>Xin Chào , ${data.PatientName}</h3>
       <p>Bạn đã nhận được mail này. Xin chúc mừng</p>
       <span>
       Xác nhận lịch khám thành công, Mời ${data.PatientName} khám vào lúc ${data.timeType}
       </span>
    
       ` 
    }
    if(data.language === 'en') {
       name = `
       <h3>Hello,  ${data.PatientName}</h3>
       <p>You have got this mail. </p>
       <div>
       Confirm successful discovery schedule. Please come  ${data.PatientName} check at ${data.timeType}
       </div>
       ` 
    }
    return name;
   }
let sendEmailAttactments = async(dataSend) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: process.env.EMAIL_APP ,
              pass: process.env.EMAIL_PASSWORD_APP
            }
        });     
        let info = await transporter.sendMail({
            from: `"Patient Response" <${process.env.EMAIL_APP}>`, // sender address
            to: `${dataSend.email}`, // list of receivers
            subject: "Kết Quả Đặt lịch khám bệnh", // Subject line
            html: buildTextFormEmailAttachments(dataSend), // html body,
            // sử dụng attachments để send mail
            attachments : [
                {   // encoded string as an attachment
                    filename: `remedy-${dataSend.patientId}-${dataSend.PatientName}.png`,
                    content: dataSend.imageBase64.split("base64,")[1],
                    encoding: 'base64'
                },
            ]
        });
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    sendEmailBooking,
    sendEmailAttactments
}
