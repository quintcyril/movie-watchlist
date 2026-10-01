# Movie create: React to MySQL

This is the worked example for **create**. Your task is to run the frontend and backend and insert at least five movies into MySQL through the React form. Once that works, continue with list, update, and delete. Work on the **MVC Sample (.NET)** sidebar page (`/mvc-sample`), not the Watchlist page: the Watchlist uses a separate Node demo server and JSON files. Movie data here is stored in MySQL through ASP.NET Core and EF Core.

## Run the example

Prerequisites: Node.js 20.19+ or 22.12+ for Vite, .NET 9 SDK for the backend, and a running MySQL server. You do **not** need to run the Node demo server for the movie create flow.

1. In `movielist_service/ASI.Basecode.WebApp/appsettings.json`, set `ConnectionStrings:DefaultConnection` to your local MySQL credentials and database name. Create an **empty** database with that name in MySQL first (the backend uses `ServerVersion.AutoDetect` when configuring EF Core). Do not create the `Movies` table by hand.
2. In Visual Studio's **Package Manager Console**, set **Default project** to `ASI.Basecode.Data` and **Startup project** to `ASI.Basecode.WebApp`. Generate and apply the initial code-first migration:

    ```powershell
    Add-Migration InitialCreate -Context AsiBasecodeDBContext
    Update-Database -Context AsiBasecodeDBContext
   ```

    This migration is based on the EF Core context and creates the modeled tables (including `Movies` and `Users`) and the `__EFMigrationsHistory` table. Commit the generated migration with the backend project; on another fresh database, run only `Update-Database`. If you already have populated tables, do not apply a new initial migration without planning how to preserve/baseline the existing schema.
3. From `movielist_service/ASI.Basecode.WebApp`, run `dotnet run`. The launch profile listens at `http://localhost:5000`; check `http://localhost:5000/swagger` if needed.
4. From `ReactBasecode`, run `npm ci`, then `npm run dev`. Open the Vite URL (normally `http://localhost:5173`). Log in with username `admin` and password `password`; the app opens the **MVC Sample (.NET)** movie form. This login checks fixed credentials in the React app for classroom use only; it does not authenticate against MySQL and must not be used as production security. No Node demo server is needed for this exercise.
5. Enter a title, genre, and release year, then select **Add Movie**. A success message with an ID means the API returned the newly saved movie. Refreshing this screen clears the message; it does not delete the database row.

## Trace one insert

Try `The Matrix`, `Sci-Fi`, `1999`. Follow the execution in this order:

1. In [MvcSample.jsx](src/Components/MvcSample/MvcSample.jsx), the form stores input in React state. `handleSubmit` prevents the browser's normal form submission, converts the year to a number, and calls `movieApi.create({ title, genre, releaseYear, watched: false })`. It shows the returned movie ID or an error. The browser does not invent the ID.
2. In [api.js](src/Common/api.js), `movieApi.create` sends JSON with `POST` to `http://localhost:5000/api/Movie`. `request` checks the HTTP status and parses the JSON response.
3. In [MovieController.cs](../movielist_service/ASI.Basecode.WebApp/Controllers/MovieController.cs), `[Route("api/[controller]")]` and `[HttpPost]` select `Create`. ASP.NET binds the JSON to `MovieViewModel`, checks validation, calls the service, and returns HTTP **201 Created** with the stored movie and a `Location` header for `GET /api/Movie/{id}`.
4. In [MovieViewModel.cs](../movielist_service/ASI.Basecode.Services/ServiceModels/MovieViewModel.cs), `Title` is required and limited to 150 characters, `Genre` to 50, and `ReleaseYear` must be 1888-2200.
5. In [MovieService.cs](../movielist_service/ASI.Basecode.Services/Services/MovieService.cs), `AddMovie` maps the view model to a database `Movie`, clears the ID so the database assigns it, sets timestamps, calls the repository, then maps the saved entity back to a view model.
6. In [MovieRepository.cs](../movielist_service/ASI.Basecode.Data/Repositories/MovieRepository.cs), `AddMovie` adds the entity and calls `SaveChanges`. [AsiBasecodeDbContext.cs](../movielist_service/ASI.Basecode.Data/AsiBasecodeDbContext.cs) maps it to the MySQL `Movies` table.

Example request body:

```json
{"title":"The Matrix","genre":"Sci-Fi","releaseYear":1999,"watched":false}
```

Example response body (the ID will differ):

```json
{"id":1,"title":"The Matrix","genre":"Sci-Fi","releaseYear":1999,"watched":false}
```

Use the browser's Network tab to inspect the POST URL, JSON body, status 201, response and `Location` header. Optionally inspect the row in MySQL with `SELECT * FROM Movies ORDER BY Id DESC;`. Try an empty title or a year outside the allowed range and compare the failure with the successful request.

## Your assignment

**Required:** Run MySQL, apply the migration, and run both the ASP.NET backend and React frontend using the steps above. On the **MVC Sample (.NET)** page, use the **Add Movie** form to insert at least **five different movies** (each with a title, genre, and valid release year). For each insert, check that the page reports a server-generated ID and the browser Network tab shows `POST /api/Movie` returning **201 Created**. Verify that all five records persist in MySQL:

```sql
SELECT Id, Title, Genre, ReleaseYear, Watched FROM Movies ORDER BY Id DESC;
```

Your required result is five matching rows inserted **from the frontend through the ASP.NET backend**, not by entering rows directly in MySQL or using the Node `/movies` endpoint. Show the running frontend and backend, the successful requests, and the database rows when demonstrating your work.

**After the five inserts work:** Continue on that same page using [api.js](src/Common/api.js) and the existing backend endpoints. The API helper exposes `getAll`, `get`, `update`, and `remove`; they are starting points, not completed UI features.

1. **List:** request `GET /api/Movie` on page load and render the saved movies, including the new one after a successful POST (without refreshing the browser). Show loading, empty, and error states.
2. **Update:** allow changing a saved movie's title, genre, release year, or watched status with `PUT /api/Movie/{id}`. Send a complete movie body: the backend replaces all four fields, not just the one you changed. Keep the UI in sync with the response or reload the list.
3. **Delete:** remove a saved movie using `DELETE /api/Movie/{id}` and update the visible list after success. The backend responds with **204 No Content**, so do not parse JSON from it.

For the follow-up CRUD work, inspect the browser Network tab, refresh the page to check persistence, and verify the rows in MySQL. A missing row on update/delete should return 404.


I will check at least the insertion next class before I discuss the CRUD process. 
Thank u..