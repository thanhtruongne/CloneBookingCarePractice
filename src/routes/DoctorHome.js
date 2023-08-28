import express from 'express';
import doctorController from '../controller/doctorController';
const router = express.Router();

router.get('/api/getDoctorHomePage',doctorController.getDoctorHomePageLimit);

router.get('/api/get-all-Doctor',doctorController.getAllDoctor);

router.get('/api/getDetailDoctorDesc',doctorController.getDetailDoctorDesc);

router.get('/api/get_TimeStamp_Doctor_Schedules',doctorController.getTimeStampDoctorSchedules);

router.get('/api/get_Doctor_Info_Schedules',doctorController.getDoctorInfoSchedules);

router.get('/api/get_time_booking_doctor_schedule',doctorController.getTimeBookingDoctorSchedule);

router.get('/api/GetDoctorSpecialtyAppointments',doctorController.GetDoctorSpecialtyAppointments)

router.get('/api/GetInfoDoctorSpecialtyIdAppointments',doctorController.GetInfoDoctorSpecialtyIdAppointments)

router.get('/api/getDataClinicDoctorAll',doctorController.getDataClinicDoctor)

router.get('/api/GetClinicDoctorById',doctorController.GetDoctorClinicDoctor)

router.get('/api/GetDataPatientList',doctorController.GetdataListPatient)

router.post('/api/saveDoctorDesc',doctorController.createDoctorDesc);

router.post('/api/bulk-create-doctor-time',doctorController.BulkCreateDoctorTime);

router.post('/api/post_booking_doctor_schedules',doctorController.PostBookingDoctorSchedules);

router.post('/api/vertify-booking-doctor-schedules',doctorController.PostVertifyBookingDoctor);

router.post('/api/PostSaveManagerDoctorAppointments',doctorController.PostSaveManagerDoctorAppointments);

router.post('/api/PostClinicManagerDoctor',doctorController.PostClinicManagerDoctor)

router.post('/api/postSendRemedyPatient',doctorController.SendRemedyPatient)


module.exports  = router;

