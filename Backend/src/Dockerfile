FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /src
COPY . .

RUN dotnet restore Backend.Api/Backend.Api.csproj
RUN dotnet publish Backend.Api/Backend.Api.csproj \
    --no-restore \
    --configuration Release \
    --output /app/out

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime

WORKDIR /app
COPY --from=build /app/out .

EXPOSE 8080
ENTRYPOINT ["sh", "-c", "ASPNETCORE_URLS=http://0.0.0.0:${PORT:-8080} exec dotnet Backend.Api.dll"]