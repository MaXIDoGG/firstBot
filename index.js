const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options.js')

const token = '5493875445:AAFltYYyPCOL1cG7k0tLmS_KxSWet_MKD9g'

const bot = new TelegramApi(token, {polling: true})

const chats = {}


const start = () => {
	bot.setMyCommands([
		{command: '/start', description: 'hello'},
		{command: '/game', description: 'game'}
	])

	bot.on('message', async msg => {
		const text = msg.text
		const chatId = msg.chat.id

		if (text === '/start') {
			await bot.sendMessage(chatId, 'Добро пожаловать!')
			return bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/a/animePackByl524l/animePackByl524l_007.webp')
		}
		
		if (text === '/game') {
			await bot.sendMessage(chatId, 'В этой игре нужно отгадать загаданную мной цифру от 0 до 9')
			const randomNumber = Math.floor(Math.random() * 10)
			chats[chatId] = randomNumber
			return bot.sendMessage(chatId, 'Можешь начинать отгадывать!', gameOptions)
		}

		return bot.sendMessage(chatId, 'Я твоя не понимать')
	})

	bot.on('callback_query', async msg => {
		const data = msg.data
		const chatId = msg.message.chat.id
		if (data === '/again') {
			const randomNumber = Math.floor(Math.random() * 10)
			chats[chatId] = randomNumber
			return bot.sendMessage(chatId, 'Можешь начинать отгадывать!', gameOptions)
		}
		if (data == chats[chatId]) {
			return await bot.sendMessage(chatId, 'Ты угадал!', againOptions)
		} else {
			return await bot.sendMessage(chatId, 'Ты не угадал! Попробуй ещё!')
		}
	})
}

start()