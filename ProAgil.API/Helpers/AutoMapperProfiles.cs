using System.Linq;
using AutoMapper;
using ProAgil.API.Dtos;
using ProAgil.Domain;

namespace ProAgil.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Evento, EventoDto>()
                .ForMember(EventoDto => EventoDto.Palestrantes, opt => {  // Mapeamento muito para muitos Leitura rápida: Para o membro Palestrantes de EventoDto atribuir os Palestrantes mapeados da fonte Evento.PalestranteEventos.Palestrante.
                    opt.MapFrom(Evento => Evento.PalestrantesEventos.Select(x => x.Palestrante).ToList());
                }).ReverseMap();
            CreateMap<Palestrante, PalestranteDto>()
                .ForMember(dest => dest.Eventos, opt => {
                    opt.MapFrom(src => src.PalestrantesEventos.Select(x => x.Palestrante).ToList());
                }).ReverseMap();
            CreateMap<RedeSocial, RedeSocialDto>().ReverseMap();
            CreateMap<Lote, LoteDto>().ReverseMap();
        }
    }
}