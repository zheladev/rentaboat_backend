# Rent a Boat backend service
set up docker container
````
docker-compose up -d
````

````
npm install
npm run dev:watch
````

## Search query

```
{URL}/entity?search=[query]
```

query syntax
```
{<entityParam><logicalOperator><paramValue>,}+
```

List of logical operators:

- Equal to `:`
- Not `<>`
- Greater Than `>`
- Greater Than or Equal To `>:`
- Lower Than `<`
- Lower Than or Equal To `<:`

example
```
URL/boats?page=0&limit=10&search=port:21f4fa5a-f075-42af-adc7-7e556652f311,passengerCapacity>:3,
```