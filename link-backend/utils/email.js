const { CLIENT_URL } = require('../config')

exports.htmlMail = (pin = 385098, username = 'there') => {
	return  `<div align="center">
		<div style="padding-left:35px;padding-right:35px;padding-top:40px;padding-bottom:40px;width:494px;height:374px;border-radius:10px;border-color:#e9e9e9;border-style:solid;border-width:1px" align="left">
			<label style="font-family:Arial;font-size:25px;line-height:29px;font-weight:bold">
				<span class="il">Reset</span> <span class="il">Password</span>
			</label>
			<div style="margin-top:30px;margin-bottom:30px">
				<label style="font-family:Arial;font-size:16px;line-height:23px;color:#979797">
					Hi, ${username}!<br><br>
					We’ve received a request to <span class="il">reset</span> your <span class="il">password</span>.<br><br>
					If you didn’t make the request, just ignore this message. Otherwise, you can <span class="il">reset</span> your <span class="il">password</span> using this code:<br>
				</label>
			</div>
			<div>
				<label style="font-family:Arial;font-size:16px;line-height:23px;color:#979797;font-weight:bold">
					Your <span class="il">Password</span> <span class="il">Reset</span> Verification PIN is:<br><br>
				</label>
				<label style="font-family:Arial;font-size:20px;line-height:25px;color:#ff475b;font-weight:bold;background-color:#ffffff;border-width:0px;padding-left:0px;padding-right:0px;text-decoration:none">
					${pin}<br>
				</label>
				<br />
				<a href="${CLIENT_URL}/reset-password" style="color: #3aa3ae;font-family: Arial; font-size: 16px">Reset Password</a>
			</div>
			<label style="font-family:Arial;font-size:16px;line-height:25px;color:#979797">
				<br>Thanks,<br>
				The Linkup Team<br>
			</label>
		</div>
	</div>`
}

exports.htmlPurchaseMail = (email, username) => {
	return `<div align="center">
		<div style="padding-left:35px;padding-right:35px;padding-top:40px;padding-bottom:40px;width:494px;height:374px;border-radius:10px;border-color:#e9e9e9;border-style:solid;border-width:1px" align="left">
			<div style="margin-top:30px;margin-bottom:30px">
				<label style="font-family:Arial;font-size:16px;line-height:23px;color:#979797">
					Hi, ${username}!<br><br>
					Thanks for purchasing your LinkUp card. As the last step in the process, please follow this link to create a password.<br><br>
					<a href="${CLIENT_URL}/set-password/${email}">Click here to create a password</a><br /><br />
					If you already did this, you can ignore this email.<br /><br />
					<br>Thanks,<br>
					The Linkup Team<br>
				</label>
			</div>
		</div>
	</div>`
}

exports.getPin = () => {
	let pin = ''
	for (let i = 0; i < 6; i++) {
		pin += parseInt(Math.random() * 10)
	}
	return pin
}
