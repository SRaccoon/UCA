var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');
const passport = require('passport');

const User = require('../models/userModel');

const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

router.get('/', (req, res) => {
    res.send("패스포트 모듈 테스트");
});

router.get('/register', (req, res) => {
    res.render('user/register');
});

router.get('/login', (req, res) => {
    res.render('user/login');
});

router.post('/register', (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                var json = {
                    email: "해당 이메일을 가진 사용자가 존재합니다."
                };
                res.json(400,json);
            } else {
                const newUser = new User({
                    email: req.body.email,
                    name: req.body.name,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) return err;

                        newUser.password = hash;

                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                })
            }
        })
});

router.post('/login', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    // email로 회원 찾기
    User.findOne({email})
        .then(user => {
            if (!user) {
                errors.email = "해당하는 회원이 존재하지 않습니다.";
                return res.status(400).json(errors);
            }

            // 패스워드 확인
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        // 회원 비밀번호가 일치할 때
                        // JWT PAYLOAD 생성
                        const payload = {
                            id: user.id,
                            name: user.name
                        };

                        // JWT 토큰 생성
                        // 1시간 동안 유효
                        jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        });
                    } else {
                        errors.password = "패스워드가 일치하지 않습니다.";
                        return res.status(400).json(errors);
                    }
                });
        })
});

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
    });
});

module.exports = router;