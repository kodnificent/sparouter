const options = {
    historyMode: true
}
const router = new SPARouter(options);
router.get('/', (req, router)=>{
    console.log(req.uri)
});
router.init();