using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

// Uma fábrica de tempo de design pode ser especialmente útil se você precisar configurar o DbContext de forma diferente 
// para o tempo de design do que no tempo de execução, se o construtor de DbContext usar parâmetros adicionais 
// não estiver registrado em DI, se você não estiver usando DI, ou se por algum motivo você prefira não ter um método 
// BuildWebHost na classe Main do aplicativo ASP.NET Core. 

namespace ProAgil.API.Data
{
    public class ProAgilContextFactory : IDesignTimeDbContextFactory<ProAgilContext>
    {
        public ProAgilContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ProAgilContext>();
            optionsBuilder.UseSqlite("Data Source = ProAgil.db");

            return new ProAgilContext(optionsBuilder.Options);
        }
    }
}