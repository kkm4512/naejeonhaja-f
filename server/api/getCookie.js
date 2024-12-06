export default defineEventHandler(event => {
  return getCookie(event, 'Authorization') 
})
