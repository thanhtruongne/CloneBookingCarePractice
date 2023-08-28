import db from '../models/index';
class Homepage {

    async getHomePage(req, res, next) {
        try {
            // truy xuất vào db có tên vào 
            let data = await db.User.findAll();
            res.render('homepage.ejs', { data: JSON.stringify(data) })
        } catch (error) {
            console.log(error)
        }
    }
    // [GET] /about
    getCRUD(req, res, next) {
        res.render('CRUD.ejs');
    }
}

module.exports = new Homepage();