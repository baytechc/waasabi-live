export const Discord = {
  open(e) {
    e.preventDefault();
    window.open(process.env.WAASABI_DISCORD_URL,'_blank')
  }
}

export default Discord;
