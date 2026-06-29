var express = require('express');
var router = express.Router();
var db=require('../db.js');
var path = require('path');
var fs=require('fs');
var { sendOTP } = require('../utils/sendOTP');
// router.get('/',(req,res)=>{
//     res.send('hi');
// });

router.get('/test-mail', async (req, res) => {

    try {

        await sendOTP(
            'YOUR_OTHER_EMAIL@gmail.com',
            '123456'
        );

        res.send('Email Sent Successfully');

    } catch (err) {

        console.log(err);

        res.send('Email Failed');

    }

});
router.get('/',(req,res)=>{
    res.render('admin/index.ejs');
})
module.exports = router;
