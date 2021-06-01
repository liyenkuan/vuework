//https://vue3-course-api.hexschool.io/api/password/products
// /api/:api_path/admin/product/:product_id
//https://vue3-coursec-api.hexschool.io/api/password/admin/product
const api = "https://vue3-course-api.hexschool.io/";
const signinPath = "admin/signin";
const productsPath = "api/password/";
let myModal = '';
let deleteModal = '';
let editModal ='';
import modals from './modals.js';
import delmodals from './delmodals.js';
import editmodals from './editmodals.js';
const Vueapp =  Vue.createApp({
    components :{
        modals,
        delmodals,
        editmodals

        },
    data(){
        return{
            product :[],
            username :'',
            password :'',
            addProduct :{
                "title": "", 
                "category": "",
                "origin_price": '',
                "price": '',
                "unit": "",
                "description": "",
                "content": "",
                "is_enabled": '',
                "imageUrl" : "",
                "imagesUrl": [
                  "",
                  "",
                  "",
                  "",
                  ""
                ]
            },
            delitem :"test",
            deleteId: 'test',
            editProduct :[],
        }
    },
    methods: {
         //取得產品
        getProductas(){
            axios.get(`${api}api/password/products`)
            .then((response) =>{
                // handle success
                console.log(response);
                this.product = response.data.products;
                console.log(this.product);
              })
              .catch(function (error) {
                // handle error
                console.log(error);
              })
              .then(function () {
                // always executed
              });
        },
        deletProducts(item,id){
            this.delitem = item.title;
            this.deleteId = id ;
            deleteModal.show();
            console.log(id);

        },
        deletProductsId(){
            axios.delete(`${api}${productsPath}admin/product/${this.deleteId}`)
            .then((res)=>{
                console.log(res);
                this.getProductas();
                this.deleteId = '';
                deleteModal.hide();
            })
        },
         //登入
        signin(){
            if(this.username!=='' && this.password!=='' ){    
                let username = this.username.trim();;
                let password = this.password.trim();;
                const url = `${api}${signinPath}`;
                console.log(url);
                const user = {
                    username,
                    password
                };
                console.log(user);
                axios.post(url, user)
                .then((res)=>{
                    console.log(res);
                    const token = res.data.token;
                    console.log(token);
                    const expired = res.data.expired;
                    console.log(expired);
                    document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
                    this.verifyToken();
                })
                .catch((error)=>{
                    console.log(error);
                })
            }
            
        },
        //驗證
        verifyToken(){
            const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            axios.defaults.headers.common['Authorization'] = token;
            axios.post(`${api}api/user/check`)
            .then((res)=>{
                console.log(res);
            })
        },
        openModal(){
            myModal.show();
        },
        postModal(e){
            console.log(e);
            const data = e;
            axios.post(`${api}${productsPath}admin/product`,{data})
            .then((res)=>{
                console.log(res);
                this.getProductas();
                myModal.hide();
            })
        },
        openEdit(id){
            this.product.forEach((item) => {
                if(item.id == id) {
                    this.editProduct = item;
                };
            });
            editModal.show();
        },
        postEdit(e){
            let id = e.id; 
            let data = e;
            axios.put(`${api}${productsPath}admin/product/${id}`,{data})
            .then((res)=>{
                console.log(res);
                this.getProductas();
                editModal.hide();
            })
        },
    },
    mounted() {
        myModal = new bootstrap.Modal(document.getElementById('productModal'));
        deleteModal = new bootstrap.Modal(document.getElementById('delProductModal'));
        editModal = new bootstrap.Modal(document.getElementById('editModal'));
        this.getProductas();
        this.verifyToken();
    },
});
Vueapp.component('card',{
   template:'#forcard',
    data(){
         return{
             text:'全域成功',
        }
    }
    });
    Vueapp.mount("#app");
