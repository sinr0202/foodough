var email = process.env.EMAIL;

Accounts.emailTemplates.siteName = "Foodough";
Accounts.emailTemplates.from     = "Foodough <"+email+">";

Accounts.emailTemplates.verifyEmail = {
	subject() {
		return "Foodough: Verify your account";
	},
	text(user, url) {
		let emailAddress   = user.emails[0].address,
			urlWithoutHash = url.replace( '#/verify-email', 'verify' ),
			supportEmail   = email,
			emailBody      = `Welcome to Foodough \n\nTo verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email.\n\n If you feel something is wrong, please contact our support team: ${supportEmail}.`;
		return emailBody;
	}
};

Accounts.emailTemplates.resetPassword = {
	subject() {
		return "Foodough: Reset your password";
	},
	text(user, url) {
		let emailAddress   = user.emails[0].address,
			urlWithoutHash = url.replace( '#/reset-password', 'password' ),
			supportEmail   = email
			emailBody      = `Hello, \n\n\ To reset your password click the link below. \n\n ${urlWithoutHash}`;
		return emailBody;
	}
};