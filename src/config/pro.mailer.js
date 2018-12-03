
const envConfig = require('./env.config');
const nodemailer = require('nodemailer');

/**email template for mailing */
const emailFormat = function () {
    const emailTemplate = `<body style="font-family:Arial, Helvetica, sans-serif; margin:0; padding:0; background-color:#ffffff">
    <center style="border:1px solid #cccccc;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="wrapper">
            <tbody>
                <tr>
                    <td align="center" height="100%" valign="top" width="100%">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff">
                            <tbody>
                                <tr>
                                    <td align="center" valign="top" style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#525252;">
                                        <div style="font-size:18px; color:#ffffff; background-color:#ffa402; height:80px; line-height:75px">
                                            <font>
                                                <font>Sanity Report</font>
                                            </font>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                </tr>
            </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;" bgcolor="#ffffff">
            <tbody>
                <tr>
                    <td valign="top" style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#525252;">
                        <div style="font-size:15px;color:#525252;background-color:#ffffff;padding: 25px 30px 0px;font-style:italic;">
                            <h3>Hi All, </h3>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;" bgcolor="#ffffff">
            <tbody>
                <tr>
                    <td align="center" valign="top" style="font-family:Arial, Helvetica, sans-serif; font-size:13px; color:#525252;">
                        <div style="font-size:15px;color:#525252;background-color:#ffffff;min-height: 130px;line-height: 30px;padding: 20px;font-style:italic;">
                            <font>Please Find attachment of "sanity report".<br/>
                                To view report extract the attached archived folder, Go to extracted folder directory.
                                Open base html file (index.html / report.html) on chrome browser. you will able to see complete set of reports.
                            </font>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;" bgcolor="#FFFFFF">
            <tbody>
                <tr>
                    <td align="center" valign="top" style="font-size:0;">
                        <div style="vertical-align:top;display: inline-block;align-self: center;width:100%;margin-bottom: 10px;background-color: #ffa402;align-items: center;max-width: 500px;">
                            <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" class="deviceWidth">
                                <tbody>
                                    <tr>
                                        <td align="center" valign="top" style="font-size: 16px;width:100%;color: #ffffff;padding: 30px 10px;font-style:italic;">
                                            Note: This is an auto generated e-mail please donot reply on it.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div style="display:inline-block; max-width:295px; vertical-align:top; width:100%;">
                            <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:295px;" class="deviceWidth">
                                <tbody>
                                    <tr>
                                        <td align="center" valign="top" style="font-size:14px;color:#525252;padding: 1.5rem;font-style:italic;">
                                            You are free to forward this mail to important id's.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#FFFFFF">
            <tbody>
                <tr>
                    <td align="center" valign="top" style="font-size:0;height: 130px;background-color: #ffa402;color: #fff;">
                        <div style="display:inline-block;max-width: 600px;vertical-align:top;width:100%;">
                            <table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" style="   
                      width: 100%; max-width: 600px;" class="deviceWidth">
                                <tbody>
                                    <tr>
                                        <td align="center" valign="top" style="font-size: 11px;color: #ffffff;padding: 1.5rem 1.5rem 0;max-width: 600px;font-style:italic;width: 100%;">Ⓒ
                                            Copyright all rights are reserved. </td>
                                    </tr>
                                    <tr>
                                        <td align="center" valign="top" style="font-size: 11px;color: #ffffff;padding: 1.5rem;max-width: 600px;font-style:italic;width: 100%;">
                                            Need Assistance? Just write to us at donotreplyme2017@gmail.com or support_noreply@zoho.com for any query you may have. Available between 10:00am and 19:00pm.<br/>
                                            All e2e (jasmine test cases, reporting, zipping and mailing) functionality is added by vikas.sarkar 👮
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>                        
                    </td>
                </tr>
            </tbody>
        </table>
    </center>
</body>`;
    return emailTemplate;
}

/**node mailer config setup*/
const setMailConfig = function () {
    var transporter = nodemailer.createTransport({
        host: envConfig.emailConfig.host,
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        debug: true,
        auth: {
            user: envConfig.emailConfig.user,
            pass: envConfig.emailConfig.pass
        }
    });
    return transporter;
};

/**node mailer mailing service*/
const mailZippedReport = function () {
    const promise = new Promise(function (resolve, reject) {
        const transporter = setMailConfig();
        const mailingTemplate = emailFormat();
        const attachFile = envConfig.archiveReportName + "." + envConfig.archiveType;
        const attachmentPath = envConfig.archiveReportPath + "\\" + attachFile;
        console.log(":::::::: 👥 MAILING SERVICE EXECUTION STARTED 👥 :::::::::::::");
        console.log("::::::::::🐴 Please wait mailing is in progress 🐴:::::::::::::::");

        transporter.sendMail({
            from: envConfig.emailConfig.mailFrom,
            subject: envConfig.emailConfig.mailSubject,
            to: envConfig.emailConfig.mailTo + ', ' + envConfig.emailConfig.adminUser,
            html: mailingTemplate,
            attachments: [{
                filename: attachFile,
                path: attachmentPath
            }]
        }, function (error, response) {
            if (!error) {
                console.log(":::::::::::: FROM - " + response.envelope.from + " :::::::::::::::");
                console.log(":::::::::::: TO - " + response.envelope.to + " :::::::::::::::");
                console.log(":::::::::::: MSSG ID - " + response.messageId + " :::::::::::::::");
                console.log("::::::::::::::::: ✔ Email sucessfully sent::::::::::::::::::::");
                transporter.close();
                resolve(response);
            } else {
                console.log(":::::::::::: ERROR CODE - " + error.code + " :::::::::::::::");
                console.log("::::::::::::: ERROR NO - " + error.errno + " :::::::::::::::::");
                console.log(":::::::::::::: X👮 Mailing service error :::::::::::::::");
                resolve(error);
            }
        });
    });
    return promise;
};

/**node mailer mailing error*/
const mailingError = function () {
    const promise = new Promise(function (resolve, reject) {
        console.log(":::::::::::::::: X👮 Mailing service error :::::::::::::::::");
        console.log("::::::: We cannot send mail as check your attachment :::::::");
        resolve();
    });
    return promise;
};

module.exports = {
    emailFormat:emailFormat,
    setMailConfig:setMailConfig,
    mailZippedReport:mailZippedReport,
    mailingError:mailingError
}