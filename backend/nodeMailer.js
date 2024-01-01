const nodemailler = require("nodemailer");

const transport = nodemailler.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: "mayeznour223@gmail.com",
    clientId:
      "970131163910-kmu1esh7alqcgkagsdo47c1i5sb2c4uv.apps.googleusercontent.com",
    clientSecret: "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",
    accessToken:
      "ya29.a0AfB_byB39WP0Iqozm_FQchhoUjlOsjEmOODx6QMcxxKHEeyWN7JaPsoXD_k8D-zAS9MG0aYo6Ho8dzS-IAlDlrRxctFcNU0MwcMjU_g0rMtHhI30RZUMe3csg7MT8L-stM3SRI8Aj8JZQLTTadM2AoubcOcgX2SuFPgBDAaCgYKAcMSARISFQHsvYlsC03U68XjMM45CMmnmana0w0173",
    expires: 3599,
    refreshToken:
      "1//04qk_V0E39YzCCgYIARAAGAQSNwF-L9Irpxbx-qtyKSjZ7FIYAao6Igxg4Or1hW_XyxXliwizG2RArENNqs6dxvtqnTltRmBDCuY",
  },
});
sendConfirmationEmail = (email) => {
  transport
    .sendMail({
      from: "mayeznour223@gmail.com",
      to: email,
      subject: "Reset your password",
      html: `<h1>Confirmation Email</h1> <h2>Hello</h2> <p>To reset your password,
       please click on this link:</p> <a href="http://localhost:3001/confirmPassword/${email}">
       Click here!</a>`,
    })
    .catch((err) => console.log(err));
};
module.exports = {
  sendConfirmationEmail: sendConfirmationEmail,
};
