function generatePassword(c) {
    var digits = '0123456789';
    var char = "#%&@!*+?"
    let OTP = [];
    for (let i = 0; i < 2; i++ ) {
        OTP.push( char[Math.floor(Math.random() * 10)])
    }
    for (let i = 0; i < c; i++ ) {
      OTP.push( digits[Math.floor(Math.random() * 10)])
  }
    for (let j = 0; j < 2; j++ ) {
      let def = 90 - 65
      OTP.push( String.fromCharCode(Math.floor(  Math.random() * def) + 65))
        }
    for (let j = 0; j < 2; j++ ) {
          let def = 122 - 97
          OTP.push( String.fromCharCode(Math.floor(  Math.random() * def) + 97))
            }
       OTP.sort(()=>Math.random() -0.5)
     let streing =  OTP.toString()
     let newrep =  streing.replaceAll(",","")
    return newrep;
  }
module.exports = generatePassword
