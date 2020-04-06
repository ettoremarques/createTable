# createTable

createTable is a Vanilla Javascript library for creating table with scroll pagination easily

## Usage

createTable is a function that accepts two parameters: $table and settings.

```bash
    createTable($table, settings);
```

### $table

$table is your table element selector


### settings

settings is an object that accepts some properties like:

    load, onBeforeLoad, onAfterLoad, ordering, scrolling, printSelector and csvSelector

    it should be something like this:

```bash
    let settings = {
        load: function,
        onAfterLoad: function,
        onBeforeLoad: function,
        ordering: boolean,
        scrolling: boolean,
        printSelector: selector,
        csvSelector: selector
    }
```

#### load
    Load is a required function that waits the resolve of a promise with the data to be insert to initiate.
    When called it returns an object with some table parameters like:
        
        sortDirection: string,
        sortField: string,
        page: number,
        start: number

    exemple:
    
    ```bash
        function load(tableAttributes) {
        return new Promise ((resolve, reject) => {
            
            let reqExemple;

            $.Ajax(reqExemple).then(data => {
                resolve(data.dataToBeUsed);
            })

        })
    }
    ```

#### onBeforeLoad
    onBeforeLoad is a function for actions to be done before executing the load function.

    when called, it returns a parameter Scroll. it has boolean value and indicate if the function call is being made by a scroll or not,
    so you can differentiate which loader to call for exemple

    ```bash
        function onBeforeLoad(scroll) {

            **actions to be made before creating the table

        }
    
    ```
    
#### onAfterLoad
    
    onAfterLoad is a function for actions to be done after executing the load function.
    when called, it returns a parameter Scroll. it has boolean value and indicate if the function call is being made by a scroll or not,
    so you can differentiate which loader to call for exemple

    ```bash
        function onBeforeLoad(scroll) {

            **actions to be made after creating the table

        }
    ```
#### ordering

    ordering is a parameter with boolean value for telling if ordering in table header is necessary or not.
    You can pass it or not, if not it won't do the logic for clicking and ordering by the table header clicked

#### scrolling

    scrolling is a parameter with boolean value for telling if you need a scroll pagination or not.
    You can pass it or not, if not it won't do the logic for scrolling and loading for adding more/new information

#### printSelector and csvSelector

    both accepts an html selector for adding the click events for exporting the table to csv or opening a new tab for printing it.


## What do i have to have on my html?

    All you need on your HTML file is a table with a table head and table body.

    you can leave the table body empty, but you have to fill the table-head to indicate which column is which adding data-name attribute to each th element

    ```bash
        <thead>
            <th data-name=""></th>
        </thead>
    ```

    the data-name attribute should match the propertie received on your request, for exemple:

    Request Response:
 ```bash
        data: [
            {
                fruit-one: banana,
                fruit-two: orange,
                fruit-three: pear,
            }
        ]
```

    HTML file:

```bash
        <thead>
            <th data-name="fruit-one">Fruit One</th>
            <th data-name="fruit-two">Fruit Two</th>
            <th data-name="fruit-three">Fruit Three</th>
        </thead>
```

    This way createTable will know which item should be in which column.

## What if i want to use table header ordering? 

    All you need to do is pass "true" as the value of the settings.ordering propertie and add which element should it start ordering.

    You should add one of two classes, sorting_asc or sorting_desc to one of the table header

    For exemple:

    ```bash
        JS file:
            settings.ordering = true;

        HTML file:

        <thead>
            <th data-name="fruit-one" class="sorting_asc">Fruit One</th>
            <th data-name="fruit-two">Fruit Two</th>
            <th data-name="fruit-three">Fruit Three</th>
        </thead>
    ```


All done, Have Fun!

Made by Ettore Marques Cimino and Victor Machado de França.