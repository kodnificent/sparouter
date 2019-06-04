const options = {
    historyMode: true
}
const router = new SPARouter(options);
router.get('/', (req, router)=>{
    console.log(router.pathFor('home'));
    window.query = req.query;
}).setName('home');
router.init();
window.router = router;