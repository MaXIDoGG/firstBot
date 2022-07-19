const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options.js')
const sequelize = require('./db')
const UserModel = require('./models')

const token = '5493875445:AAFltYYyPCOL1cG7k0tLmS_KxSWet_MKD9g'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const start = async () => {
	try {
		await sequelize.authenticate()
		await sequelize.sync()
	} catch (e) {
		console.log(e)
	}

	bot.setMyCommands([
		{command: '/start', description: 'hello'},
		{command: '/info', description: 'info'},
		{command: '/game', description: 'game'}
	])

	bot.on('message', async msg => {
		const text = msg.text
		const chatId = msg.chat.id


		try {
			if (text === '/start') {
				await UserModel.create({chatId})
				await bot.sendMessage(chatId, 'Добро пожаловать!')
				return bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/a/animePackByl524l/animePackByl524l_007.webp')
			}

			if (text === '/info') {
				const user = await UserModel.findOne({chatId})
				return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name}, в игре у тебя правильных ответов: ${user.right}, неправильных: ${user.wrong}`)
			}
			
			if (text === '/game') {
				await bot.sendMessage(chatId, 'В этой игре нужно отгадать загаданную мной цифру от 0 до 9')
				const randomNumber = Math.floor(Math.random() * 10)
				chats[chatId] = randomNumber
				return bot.sendMessage(chatId, 'Можешь начинать отгадывать!', gameOptions)
			}

			return bot.sendMessage(chatId, 'Я твоя не понимать')
		} catch (e) {
			console.log(e)
			return bot.sendMessage(chatId, 'Произошла ошибка, сорян((')
		}
		
	})

	bot.on('callback_query', async msg => {
		const data = msg.data
		const chatId = msg.message.chat.id
		const user = await UserModel.findOne({chatId})
		if (data === '/again') {
			const randomNumber = Math.floor(Math.random() * 10)
			chats[chatId] = randomNumber
			return bot.sendMessage(chatId, 'Можешь начинать отгадывать!', gameOptions)
		}
		if (data == chats[chatId]) {
			user.right += 1
			await bot.sendMessage(chatId, 'Ты угадал!', againOptions)
		} else {
			user.wrong += 1
			await bot.sendMessage(chatId, 'Ты не угадал! Попробуй ещё!')
		}
		await user.save()
	})
}

start()