// 'use server';
import { Demo } from '@/types';

const productsApiUrl = 'http://localhost:8080/v1/products';

export function removeProp<T extends object, K extends keyof T>(obj: T, prop: K): Omit<T, K> {
    const { [prop]: _, ...rest } = obj;
    return rest;
}

export const ProductServiceRestAPI = (keycloakToken: string) => ({
    listAll() {
        return fetch(productsApiUrl, { headers: { 'Cache-Control': 'no-cache', 'Authorization': `Bearer ${keycloakToken}` } })
            .then((res) => res.json())
            .then((d) => d as Demo.ProductAPI[]);
    },
    getById(id: string) {
        return fetch(`${productsApiUrl}/${id}`, { headers: { 'Cache-Control': 'no-cache', 'Authorization': `Bearer ${keycloakToken}` } })
            .then((res) => res.json())
            .then((d) => d as Demo.ProductAPI);
    },
    create(product: Demo.ProductAPI) {
        return fetch(productsApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${keycloakToken}`
            },
            body: JSON.stringify(product)
        }).then((res) => res.json());
    },
    update(product: Demo.ProductAPI) {
        return fetch(productsApiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Authorization': `Bearer ${keycloakToken}`
            },
            body: JSON.stringify(product)
        }).then((res) => res.json());
    },
    delete(id: string) {
        return fetch(`${productsApiUrl}/${id}`, {
            method: 'DELETE',
            headers: { 'Cache-Control': 'no-cache', 'Authorization': `Bearer ${keycloakToken}` }
        }).then((res) => res.json());
    },
});
