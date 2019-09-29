const nodemailer = require('nodemailer');
const pug = require('pug');
const path = require('path');
const email_type = ['full', 'upcoming', 'update', 'confirmation', 'cancellation'];
const organization_email = 'testsendemail1122@gmail.com';
const organization_email_pass = 'Tttt1234';

//an example of how to use the function
//sendEmail(user, event, 'confirmation').catch(console.error);
// var user = 
// {
// 	name: 'Test'
// }

// var event = 
// {
// 	name: 'TestEvent',
// 	description: 'A stub event',
// 	mailing_list: ['testsendemail1122@gmail.com', 'testsendemail1122+another@gmail.com'],
// 	date: '14:00 Monday 20 Sep 3020'	
// }

function selectTemplate(type) {
	if (type === email_type[0]) {
		template = 'FullSubscribe';
	} else if (type === email_type[1]) {
		template = 'EventUpcoming';
	} else if (type === email_type[2]) {
		template = 'EventUpdate';
	} else if (type === email_type[3]) {
		template = 'Confirmation';
	} else if (type === email_type[4]) {
		template = 'Cancellation';
	} else {
		console.log("Invalid request");
		template = 'Invalid';
	}
	return template;
}

function selectSubject(event, type) {
	if (type === email_type[0]) {
		subject = `Fully subscribed of event ${event.name}`;
	} else if (type === email_type[1]) {
		subject = `Upcoming event ${event.name}`;
	} else if (type === email_type[2]) {
		subject = `Event ${event.name} has new updates`;
	} else if (type === email_type[3]) {
		subject = `Confirmation of event ${event.name} registration`; 
	} else if (type === email_type[4]) {
		subject = `Event ${event.name} cancellation`;
	} else {
		subject = 'Invalid';
	}
	return subject;
} 


async function sendEmail(user, event, type) {
	var myTemplate = pug.compileFile(path.resolve(__dirname) + `\\Emails\\${selectTemplate(type)}\\html.pug`);
    if (type !== "invalid") { 
    // create reusable transporter object using the default SMTP transport
    	try {
		    let transporter = nodemailer.createTransport({
		        host: 'smtp.gmail.com',
		      	port: 587,
		        secure: false, // true for 465, false for other ports
		        auth: {
		            user: organization_email, 
		            pass: organization_email_pass
		        }
		    });
		    console.log(`Created transport using gmail service ${transporter.host, transporter.port}`)
		}
		catch(err) {
			res.status(500).send(`Failed to create smtp mail transport service`);
		}
		try {
		    // send mail with defined transport object
		    let info = await transporter.sendMail({
		        from: organization_email, 
		        to: event.mailing_list,
		        subject: selectSubject(event, type),
		        html: myTemplate({userName: user.name, name: event.name, description: event.description, date: event.date})
		    });
		    console.log(`Send email to mailing_list`)
		}
		catch(err) {
			res.status(500).send(`Failed to send mail using smtp mail transport service`);
		}
	}
}

module.export = {
	sendEmail,
	email_type
};

