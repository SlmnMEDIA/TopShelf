import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let RaidSchema = new Schema({
	lastModified: {
		type: Date
	},
	raidName: String,
	raidZone: {
		type: String,
		enum: ['Highmaul', 'Blackrock Foundry', 'Hellfire Citadel']
	},
	nOfPlayers: String,
	edition: String,
	description: String,
	startDate: Date,
	endDate: Date,
	startHour: String,
	organizer: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	players: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	}
});

module.exports = mongoose.model('Raid', RaidSchema);
