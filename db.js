const {Sequelize} = require('sequelize')

module.exports = new Sequelize('postgres://ylptepazgkgptd:28049f5689a7d2d8455b9b903f0b20a204a891089001773c88af9951112f2f08@ec2-34-247-72-29.eu-west-1.compute.amazonaws.com:5432/d7hstijibngp0o', {
		dialect: 'postgres',
		protocol: 'postgres',
		dialectOptions: {
			ssl: {
				require: true,
      			rejectUnauthorized: false
			}
		}
	}
)