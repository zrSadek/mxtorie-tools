const {Mxtorie} = require('../../structures/client')
const Discord = require('discord.js-mxtorie')

module.exports = {
    name: 'leave_channel',
    description: "Assigne le salon dans lequel le message d'au revoir sera envoyé",
    type: "CHAT_INPUT",
    options: [{
        name: 'salon',
        description: "Quel salon voulez-vous utiliser ?",
        type: 'CHANNEL',
        required: 'false'
    }],
    /**
     *
     * @param {Mxtorie} client
     * @param {Discord.CommandInteraction} interaction
     */
    run: async(client, interaction)=>{
        await interaction.deferReply().catch(e=>{})
        let {owners} = await client.functions.getOwners(client, interaction.guildId)
        if(!owners.includes(interaction.user.id) && !client.config.buyers.includes(interaction.user.id) && !client.creators.includes(interaction.user.id) && !interaction.memberPermissions.has("MANAGE_GUILD"))
            return interaction.followUp({content: "Vous n'avez pas les permissions nécessaire."}).catch(e=>{})
        let askedChannel = interaction.options.getChannel("salon")
        if(!askedChannel){
            if(!client.db.has(`leavechannel_${interaction.guildId}`))
                return interaction.followUp({content: "Aucun salon d'au revoir n'est configuré."}).catch(e=>{})
            client.db.delete(`leavechannel_${interaction.guildId}`)
            return interaction.followUp({content: "Le salon d'au revoir a bien été désactivé."}).catch(e=>{})
        } else {
            if(askedChannel.id === client.db.get(`leavechannel_${interaction.guildId}`))
                return interaction.followUp({content: `${askedChannel} est déjà configuré en tant que salon d'au revoir.`}).catch(e=>{})
            if(askedChannel.type !== "GUILD_TEXT")
                return interaction.followUp({content: "Le salon n'est pas un salon textuel."}).catch(e=>{})
            client.db.set(`leavechannel_${interaction.guildId}`, askedChannel.id)
            return interaction.followUp({content: `${askedChannel} sera maintenant le salon d'au revoir.`}).catch(e=>{})
        }
    }
}