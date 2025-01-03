const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Настройки SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.email.eu-frankfurt-1.oci.oraclecloud.com',
    port: 587,
    secure: false,
    tls: true,
    auth: {
        user: 'ocid1.user.oc1..aaaaaaaacpg2t7q5lr6pj44f33i5gen7bltdon6gupgm47w2hkzmua6hhbra@ocid1.tenancy.oc1..aaaaaaaa6nyl7fiqeekzgguux2kpq7zycv2f3x2an7ancglocdot6ivjpd2q.9d.com',
        pass: '4X1(Og8le}ZLF;]lLD6Z'
    }
});

// Функция для загрузки HTML-шаблона
function getTemplate(templateName) {
    const filePath = path.join(__dirname, 'emailTemplates', `${templateName}.html`);
    return fs.readFileSync(filePath, 'utf-8');
}

// Функция для отправки письма с нужным шаблоном
async function sendEmail(to, subject, templateName, variables = {}) {
    // Загрузка HTML-шаблона
    let htmlContent = getTemplate(templateName);

    // Замена переменных в шаблоне
    Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        htmlContent = htmlContent.replace(regex, variables[key]);
    });

    const mailOptions = {
        from: 'NeuronChat <system@neuronchat.net>',
        to: to,
        subject: subject,
        html: htmlContent // Используем HTML-шаблон
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email: ', error);
        throw error;
    }
}

module.exports = { sendEmail };