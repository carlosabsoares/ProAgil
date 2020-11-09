using ProAgil.Domain;
using System.Threading.Tasks;

namespace ProAgil.Repository
{
    public interface IProAgilRepository
    {
        //Geral
        void Add<T>(T entity) where T : class;

        void Update<T>(T entity) where T : class;

        void Delete<T>(T entity) where T : class;

        Task<bool> SaveChangesAsync();

        //Eventos
        Task<Evento[]> GetAllEventoAsyncByTema(string tema, bool includePalestrante);

        Task<Evento[]> GetAllEventoAsync(bool includePalestrante);

        Task<Evento> GetEventoAsyncById(int EventoId, bool includePalestrante);

        //Palestrate
        Task<Palestrante[]> GetAllPalestranteAsyncByName(string nome, bool includeEventos);

        Task<Palestrante> GetPalestranteAsync(int PalestranteId, bool includeEventos);

        Task<Palestrante[]> GetAllPalestranteAsync(bool includePalestranteEvento);
    }
}