import { Button, Spinner, Col, Form, InputGroup,Row} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { consultarCategoria } from '../../../servicos/servicoCategoria';
import { gravarProduto, alterarProduto} from '../../../servicos/servicoProduto';

import toast, {Toaster} from 'react-hot-toast';

export default function FormCadProdutos(props) {
    const [produto, setProduto] = useState(props.produtoSelecionado);
    const [formValidado, setFormValidado] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [temCategorias, setTemCategorias] = useState(false);

    useEffect(()=>{
        consultarCategoria().then((resultado)=>{
            if (Array.isArray(resultado)){
                setCategorias(resultado);
                setTemCategorias(true);
                toast.success("Categorias Carregadas com Sucesso!");
            }
            else{
                toast.error("Não foi possível carregar as categorias");
            }
        }).catch((erro)=>{
            setTemCategorias(false);
            toast.error("Não foi possível carregar as categorias");
        });
        
    },[]); //didMount

    function selecionarCategoria(evento){
        setProduto({...produto, 
                       categoria:{
                        codigo: evento.currentTarget.value

                       }});
    }

    function manipularSubmissao(evento) {
        const form = evento.currentTarget;
        if (form.checkValidity()) {
            if (!props.modoEdicao) {
                gravarProduto(produto)
                    .then((resultado) => {
                        if (resultado.status) {
                            props.setExibirTabela(true);
                            toast.success("Produto cadastrado com sucesso!");
                        }
                        else
                            toast.error(resultado.mensagem);
                    });
                // Nosso cadastro, anteriormente, salvava o produto em uma lista de dados mockados.
                // props.setListaDeProdutos([...props.listaDeProdutos, produto]); // Array vazio está recebendo o conteúdo da lista espalhada mais o produto
                // Exibir tabela com o produto incluído
                // props.setExibirTabela(true);
            } else {
                alterarProduto(produto)
                    .then((resultado) => {
                        if (resultado.status) {
                            props.setModoEdicao(false);
                            toast.success("Produto alterado com sucesso!");
                        }
                        else
                            toast.error(resultado.mensagem);
                    });
                // Não é necessário esparramar a lista pois o .map retorna um novo array
                // props.setListaDeProdutos([...props.listaDeProdutos.map((item) => ...
                // props.setListaDeProdutos(props.listaDeProdutos.map((item) => {
                //     return item.codigo === produto.codigo ? produto : item;
                //}));
                // O algoritmo abaixo excluia o elemento alterado e adicionava-o no final, desordenando a lista
                // props.setListaDeProdutos([...props.listaDeProdutos.filter((item) => item.codigo !== produto.codigo), produto]);
                //props.setModoEdicao(false);
            }
            props.setExibirTabela(true)
            props.setProdutoSelecionado({
                codigo: 0,
                descricao: "",
                precoCusto: "",
                precoVenda: "",
                qtdEstoque: "",
                urlImagem: "",
                dataValidade: "",
                categoria: {}
            });
            setFormValidado(false);
        } else {
            setFormValidado(true);
        }
        evento.preventDefault();
        evento.stopPropagation();
    }

    function manipularMudanca(evento) {
        const elemento = evento.target.name;
        const valor = evento.target.value;
        setProduto({ ...produto, [elemento]: valor });
        console.log(`componente: ${elemento} : ${valor}`);
    }

    return (
        <Form noValidate validated={formValidado} onSubmit={manipularSubmissao}>
            <Row className="mb-4">
                <Form.Group as={Col} md="4">
                    <Form.Label>Código</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="codigo"
                        name="codigo"
                        value={produto.codigo}
                        disabled={props.modoEdicao}
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type='invalid'>Por favor, informe o código do produto!</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="12">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="descricao"
                        name="descricao"
                        value={produto.descricao}
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type="invalid">Por favor, informe a descrição do produto!</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="4">
                    <Form.Label>Preço de Custo:</Form.Label>
                    <InputGroup hasValidation>
                        <InputGroup.Text id="precoCusto">R$</InputGroup.Text>
                        <Form.Control
                            type="text"
                            id="precoCusto"
                            name="precoCusto"
                            aria-describedby="precoCusto"
                            value={produto.precoCusto}
                            onChange={manipularMudanca}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, informe o preço de custo!
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="4">
                    <Form.Label>Preço de Venda:</Form.Label>
                    <InputGroup hasValidation>
                        <InputGroup.Text id="precoVenda">R$</InputGroup.Text>
                        <Form.Control
                            type="text"
                            id="precoVenda"
                            name="precoVenda"
                            aria-describedby="precoVenda"
                            value={produto.precoVenda}
                            onChange={manipularMudanca}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, informe o preço de venda!
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="4">
                    <Form.Label>Qtd em estoque:</Form.Label>
                    <InputGroup hasValidation>
                        <InputGroup.Text id="qtdEstoque">+</InputGroup.Text>
                        <Form.Control
                            type="text"
                            id="qtdEstoque"
                            name="qtdEstoque"
                            aria-describedby="qtdEstoque"
                            value={produto.qtdEstoque}
                            onChange={manipularMudanca}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor, informe a quantidade em estoque!
                        </Form.Control.Feedback>
                    </InputGroup>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="12">
                    <Form.Label>Url da imagem:</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="urlImagem"
                        name="urlImagem"
                        value={produto.urlImagem}
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type="invalid">Por favor, informe a url da imagem do produto!</Form.Control.Feedback>
                </Form.Group>
            </Row>
            <Row className="mb-4">
                <Form.Group as={Col} md="4">
                    <Form.Label>Data Validade</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="dataValidade"
                        name="dataValidade"
                        value={produto.dataValidade}
                        onChange={manipularMudanca}
                    />
                    <Form.Control.Feedback type="invalid">Por favor, informe a data de validade do produto!</Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md={7}>
                    <Form.Label>Categoria:</Form.Label>
                    <Form.Select id='categoria' 
                                 name='categoria'
                                 onChange={selecionarCategoria}>
                        {// criar em tempo de execução as categorias existentes no banco de dados
                            categorias.map((categoria) =>{
                                return <option value={categoria.codigo}>
                                            {categoria.descricao}
                                       </option>
                            })
                        } 
                    </Form.Select>
                </Form.Group>
                <Form.Group as={Col} md={1}>
                    {
                      !temCategorias ? 
                        <Spinner className='mt-4' animation="border" variant="success" />
                      : ""
                    }
                </Form.Group>
            </Row>
            <Row className='mt-2 mb-2'>
                <Col md={1}>
                    <Button type="submit" disabled={!temCategorias}>
                        {
                            props.modoEdicao ? 
                            "Alterar" : 
                            "Cadastrar"
                        }
                    </Button>
                </Col>
                <Col md={{ offset: 1 }}>
                    <Button onClick={() => {
                        props.setExibirTabela(true);
                    }}>Voltar</Button>
                </Col>
            </Row>
            <Toaster position="top-right"/>
        </Form>
        
    );
}