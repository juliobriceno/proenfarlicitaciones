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
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }

            transport.close();
        });


    }
}
