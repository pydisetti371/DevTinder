const validator = require('validator');

const SignUpValidate = (req) => {
    const { firstName, lastName, emailId, password } = req;
    if (!firstName || !lastName) {
        throw new Error("firstName and lastName should not be empty")
    } else if ((firstName.length < 4 || firstName.length > 20 )|| (lastName.length < 4 || lastName.length > 20)) {
        throw new Error("Please pass enter min 4 characters")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter valid password")
    }


}
module.exports = {
    SignUpValidate: SignUpValidate
}