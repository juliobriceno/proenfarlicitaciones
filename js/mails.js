var MyMongo = require('./mymongo.js');

module.exports = {
    SendEmail: function SendEmail(message, to, subject, attachments)
    {

        var nodemailer = require('nodemailer');
        var smtpTransport = require('nodemailer-smtp-transport');

        var mailAccountUser = 'web@proenfar.com'
        var mailAccountPassword = 'W3bm4st3r2017*'

        var fromEmailAddress = 'web@proenfar.com'
        var toEmailAddress = to

        var transport = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            auth: {
                user: mailAccountUser,
                pass: mailAccountPassword
            },
            tls: {
                rejectUnauthorized: false
            }
        }))

        var mail = {
            from: fromEmailAddress,
            to: toEmailAddress,
            subject: subject,
            text: "Hello!",
            html: message,
            attachments: attachments
        }

        transport.sendMail(mail, function (error, response) {
            var datSentEmail = new Date();
            if (error) {
              MyMongo.Insert('SentEmails', { to: toEmailAddress, msg: message, sent: false, error: error, SentDate: datSentEmail }, function (result) {
              });
            } else {
              MyMongo.Insert('SentEmails', { to: toEmailAddress, msg: message, sent: true, error: '', SentDate: datSentEmail }, function (result) {
              });
            }

            transport.close();
        });


    }
}
