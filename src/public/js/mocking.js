//PF/src/public/js/mocking.js
import {createHash} from '../../utils.js';
import { faker } from '@faker-js/faker';

class MockingService {
    generateUsers(num){
        const users = [];
        for (let i = 0; i < num; i++){
            const user = {
                first_name: faker.person.firstName(),
                last_name: faker.person.lastName(),
                email: faker.internet.email(),
                age: faker.number.int({min: 18, max:80}),
                password: createHash('coder123'),
                role: faker.helpers.arrayElement(['user', 'admin']),
                products:[],
            };
            users.push(user);
        }
        return users;
    }

    generateProducts(num){
        const products = [];
        for(let i = 0; i < num; i++){
            const product = {
                nombre: faker.commerce.productName(),
                descripcion: faker.commerce.productDescription(),
                precio: faker.number.int({min: 10, max: 20000}),
                stock: faker.number.int({ min: 0,max: 100}),
                category: faker.commerce.department(),
            };
            products.push(product);
        }
        return products;
    }
}

export default new MockingService();