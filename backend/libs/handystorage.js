const handystorage=require("handy-storage");
const storage=new handystorage({
    beutify: true,
});
storage.connect("./state.json");
module.exports=storage;