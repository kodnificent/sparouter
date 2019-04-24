const options = {
    historyMode: true
}
const router = new SPARouter(options);
router.get('/examples/index.html', (req, router)=>{
    console.log(req.uri)
});
router.init();