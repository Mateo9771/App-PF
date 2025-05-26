//PF/src/routes/mocks.router.js
import { Router } from "express";
import MockingService from '../public/js/mocking.js';
import UsersDAO from '../services/dao/users.dao.js';
import UserDTO from '../services/dto/users.dto.js';
import ProductDTO from '../services/dto/product.dto.js';
import ProductDAO from '../services/dao/product.dao.js'
import { faker } from "@faker-js/faker";

const router = Router();

router.get('/mockingusers', async (req, res) => {
    try{
        const users = MockingService.generateUsers(50);
        //simular mongo
        const UsersDTO = users.map(user => new UserDTO({
            ...user,
            _id: faker.database.mongodbObjectId(),
        }));
        res.status(200).json({
            status:'success',
            payload: UsersDTO,
        });
    } catch(error){
        console.error('Error al generar usuarios simulados: ', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al generar usuarios simulados',
            error: error.message,
        })
    }
});

router.get('/mockingproducts', async(req, res) => {
    try{
        const products = MockingService.generateProducts(50);
        const ProductsDTO = products.map(product => new ProductDTO({
            ...product,
            _id: faker.database.mongodbObjectId()
        }));
        res.status(200).json({
            status: 'success',
            payload: ProductsDTO,
        });
    } catch(error){
        console.error('Error al generar productos simulados: ', error);
        res.status(500).json({
            status: 'error',
            message:'Error al generar productos simulados',
            error: error.message,
        })
    }
})

router.post('/generateData', async (req,res) => {
    try{
        const { users = 0, products = 0} = req.body;

        if(!Number.isInteger(users) || !Number.isInteger(products) || users < 0 || products < 0){
            return res.status(400).json({
                status:'error',
                message:'Los parametros "users" y "products" deben ser numeros enteros no negativos'
            })
        }

        const mockUsers =  MockingService.generateUsers(users);
        const insertedUsers = [];
        for(const user of mockUsers){
            const createdUser = await UsersDAO.create(user);
            insertedUsers.push(new UserDTO(createdUser))
        }

        const mockProducts = MockingService.generateProducts(products);
        const insertedProducts = [];
        for(const product of mockProducts){
            const createdProduct = await ProductDAO.create(product);
            insertedProducts.push(new ProductDTO(createdProduct));
        }

        res.status(201).json({
            status:'success',
            message:'Datos generados e insertados correctamente',
            users:insertedUsers,
            products: insertedProducts
        });
    } catch (error){
        console.error('Error al generar e insertar datos: ', error);
        res.status(500).json({
            status: 'error',
            message: 'Error al generar e insertar datos',
            error: error.message,
        })
    }
})

export default router