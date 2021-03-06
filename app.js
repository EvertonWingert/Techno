

const vm = new Vue({
    el: "#app",
    data: {
        produtos: [],
        carrinho: [],
        produto: false,
        mensagemAlerta: "item Adicionado",
        alertaAtivo: false,
        carrinhoAtivo: false,
    },
    filters: {
        numeroPreco(valor){
            return valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });
        }
    },
    computed: {
        carrinhoTotal(){
            let total = 0;
            if(this.carrinho.length){
                this.carrinho.forEach(item =>{
                    total += item.preco;
                })
            }
            return total;
        }
    },
    methods: {
        fetchProdutos(){
            fetch("./api/produtos.json")
                .then(r => r.json())
                .then(r => {
                    this.produtos = r;
                })
        },
        fetchProduto(id){
            fetch(`./api/produtos/${id}/dados.json`)
                .then(r => r.json())
                .then(r => {
                    this.produto = r;
            });
        },
        abrirModal(id){
            this.fetchProduto(id);
            window.scrollTo(
                {
                    top: 0,
                    behavior: "smooth"
                }
            )

        },
        fecharModal(event){
            if(event.target == event.currentTarget){
                this.produto = false;
            }
            
        },
        fecharCarrinho(event){
            if(event.target == event.currentTarget){
                this.carrinhoAtivo = false;
            }
        },
        adicionarCarrinho(){
            this.produto.estoque--;
            const {id, nome, preco} = this.produto;
            this.carrinho.push({id, nome, preco});
            this.alertaAtivo = true;
            this.alerta(nome);
            
        },
        removerItem(index){
            this.produtos.estoque--;
            this.carrinho.splice(index, 1);
        },
        checarLocalStorage(){
            if(window.localStorage.carrinho){
                this.carrinho = JSON.parse(window.localStorage.carrinho);
            }
        },
        alerta(produto){
            this.mensagemAlerta = `${produto} adicionado ao carrinho`;
            setTimeout(() => {
                this.alertaAtivo = false;
            }, 1500);
        },

        compararEstoque(){
            const items =this.carrinho.filter(({id}) =>id === this.produto.id)
            this.produto.estoque -= items.length;
        },
        router(){
            const hash = document.location.hash;
            console.log(hash);
            if(hash){
                this.fetchProduto(hash.replace("#", ""));
            }
        }
        
    },
    watch: {
        produto(){
            document.title = this.produto.nome || "Techno";
            const hash = this.produto.id || "";
            history.pushState(null,null, `#${hash}`);
            if(this.produto){
                this.compararEstoque();
            }
        },
        carrinho(){
            window.localStorage.carrinho = JSON.stringify(this.carrinho);
        }
    },
    created(){
        this.fetchProdutos();
        this.router();
        this.checarLocalStorage();
    }
})