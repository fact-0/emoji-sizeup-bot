const Discord = require('discord.js');
const discordClient = new Discord.Client();
const MessageEmbed = Discord.MessageEmbed;

const { TOKEN } = require('./config.json');
const fs = require('fs');
const article = fs.readFileSync("README.md").toString();

const CodeBlock = function(text) {
	return `\`\`\`${text}\`\`\``;
}

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}!`);
});

discordClient.on('message', msg => {
	const {content, channel, author} = msg;
	const currentChannel = channel.name;
	const prefix = '-';

	//테스트용
	// if(author.username === 'fact'){
	// 	console.log(content);
	// }

	if(author.bot){
		return;
	}

	if(content.startsWith('<:') && content.endsWith('>')){
		const emoji_id = content.replace('<:', '').split('>')[0].split(':')[1];
		const emoji_url = `https://cdn.discordapp.com/emojis/${emoji_id}.png`;

		const imageEmbed = new MessageEmbed()
		//.setColor('#0099ff')
		.setImage(emoji_url)
		.setAuthor(author.username, author.avatarURL(), author.avatarURL())
		// .setTimestamp()
		// .setFooter('확대', discordClient.users.cache.get('946542826777366599').avatarURL());

		channel.send(imageEmbed);

		/*time unitl delete in milliseconds*/
		msg.delete({ timeout: 500 });
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