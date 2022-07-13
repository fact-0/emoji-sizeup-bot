const Discord = require('discord.js');
const discordClient = new Discord.Client();
const MessageEmbed = Discord.MessageEmbed;

const { TOKEN } = require('./config.json');
const fs = require('fs');
const article = fs.readFileSync("README.md").toString();

const CodeBlock = function(text) {
	return `\`\`\`${text}\`\`\``;
}
const callNickname = function (guild, author){
	const member = guild.member(author);
	return member ? member.displayName : author.username;
}

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on('message', msg => {
	const {content, channel, author, guild} = msg;
	const currentChannel = channel.name;
	const prefix = '확대봇';

	//테스트용
	// if(author.username === 'fact'){
	// 	console.log(content);
	// }

	// if(author.username !== 'fact'){
	// 	return;
	// }

	if(author.bot){
		return;
	}
	
	const nickname = callNickname(guild, author);

	if(content.startsWith('<:') && content.endsWith('>')){
		const emoji_id = content.replace('<:', '').split('>')[0].split(':')[1];
		const emoji_url = `https://cdn.discordapp.com/emojis/${emoji_id}.png`;
		
		const imageEmbed = new MessageEmbed()
		//.setColor('#0099ff')
		.setImage(emoji_url)
		.setAuthor(nickname, author.avatarURL(), author.avatarURL())
		// .setTimestamp()
		// .setFooter('확대', discordClient.users.cache.get('946542826777366599').avatarURL());

		channel.send(imageEmbed);

		/*time unitl delete in milliseconds*/
		msg.delete({ timeout: 500 });
	}

	//리스트 채널에서 이미지 목록 불러옴 최대 100개
	if(content.startsWith(':')){
		const channelList = [...guild.channels.cache]
		.filter((e)=> e[1].type === 'text')
		.map((e)=>{
			return {
				id: e[1].id,
				name: e[1].name,
			}
		});

		//스티커 목록 채널 찾기
		const stickerChannel = channelList.find((element)=>{
			return element.name.includes('스티커');
		});

		if(stickerChannel !== undefined){
			//스티커 목록 리로드
			guild.channels.cache.get(stickerChannel.id)
			.messages.fetch({ limit: 100 })
			.then(messages => {
				const stickerList = messages
								.filter((m)=>{
									return [...m.attachments].length > 0;
								})
								.map((m)=>{
									return {
										name: m.content,
										url: [...m.attachments][0][1].url
									}
								});

				const stickerName = content.endsWith(':') ? content.substring(1, content.length - 1) : content.substring(1);
				const sticker = stickerList.find((s)=>s.name === stickerName);

				if(sticker !== undefined){
					const imageEmbed = new MessageEmbed()
					.setImage(sticker.url)
					.setAuthor(nickname, author.avatarURL(), author.avatarURL());
	
					channel.send(imageEmbed);
	
					/*time unitl delete in milliseconds*/
					msg.delete({ timeout: 500 });
				}
			});
		}
		return;
	}

	if(content.startsWith(prefix)){
		const command = content.replace(prefix, '');
		if(command === 'hellothisisverification'){
			channel.send('fact#4858(353467095876501504)');
			return;
		}

		if(command === '도움말'){
			channel.send("\`\`\`"+article+"\`\`\`");
			return;
		}
		return;
	}

});

discordClient.on("error", () => { console.log("error"); });

discordClient.login(TOKEN);