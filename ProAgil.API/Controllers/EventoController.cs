using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.API.Dtos;
using ProAgil.Domain;
using ProAgil.Repository;

namespace ProAgil.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase
    {
        public readonly IProAgilRepository _repo;
        public readonly IMapper _mapper;
        public EventoController(IProAgilRepository repo, IMapper mapper)
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var eventos = await _repo.GetAllEventoAsync(true);

                // var results = _mapper.Map<IEnumerable<EventoDto>>(eventos);
                var results = _mapper.Map<EventoDto[]>(eventos);

                return Ok(results);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de dados falhou. {ex.Message}");
            }

        }

        [HttpGet("{EventoId}")]
        public async Task<IActionResult> Get(int EventoId)
        {
            try
            {
                var evento = await _repo.GetEventoAsyncById(EventoId, true);

                var result = _mapper.Map<EventoDto>(evento);

                return Ok(result);
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de dados falhou. {ex.Message}");
            }

        }

        [HttpGet("getByTema/{Tema}")]
        public async Task<IActionResult> Get(string Tema)
        {
            try
            {
                var evento = await _repo.GetAllEventoAsyncByTema(Tema, true);

                var results = _mapper.Map<EventoDto[]>(evento);

                return Ok(results);
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou.");
            }

        }

        [HttpPost]
        public async Task<IActionResult> Post(EventoDto model)
        {
            try
            {

                var evento = _mapper.Map<Evento>(model);
                
                _repo.Add(evento);

                if (await _repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{evento.Id}", _mapper.Map<EventoDto>(evento));
                }
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                    $"Banco de dados falhou.{ex.Message}");
            }
            return BadRequest();
        }

        [HttpPost("upload")]
        public async Task<IActionResult> upload()
        {
            try
            {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine("Resources", "images");
                var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);

                if(file.Length > 0){
                    var filename = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName;
                    var fullPath = Path.Combine(pathToSave, filename.Replace("\"", " ").Trim());

                    using(var stream = new FileStream(fullPath, FileMode.Create)){
                        file.CopyTo(stream);
                    }
                }

                return Ok();
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, 
                    $"Banco de dados falhou.{ex.Message}");
            }

            // return BadRequest("Erro ao tentar realizar upload.");
        }

        [HttpPut("{EventoId}")]
        public async Task<IActionResult> Put(int EventoId, EventoDto model)
        {
            try
            {   
                var evento = await _repo.GetEventoAsyncById(EventoId, false);
                if (evento == null) return NotFound();
                
                var idLotes = new List<int>();
                var idRedesSociais = new List<int>();
                
                model.Lotes.ForEach(item => idLotes.Add(item.Id));
                model.RedesSociais.ForEach(item => idRedesSociais.Add(item.Id));
                
                /* Forma mais verbosa mas tambem funcional
                foreach (var item in model.Lotes)
                    idLotes.Add(item.Id);

                foreach (var item in model.RedesSociais)
                    idRedesSociais.Add(item.Id);
                */
                // Pegando somente os lotes/redes que nao vieram no model
                var lotes = evento.Lotes.Where(lote => !idLotes.Contains(lote.Id)).ToArray();
                var redesSociais = evento.RedesSociais.Where(rede => !idRedesSociais.Contains(rede.Id)).ToArray();
                
                if(lotes.Length > 0) _repo.DeleteRange(lotes);
                
                if(redesSociais.Length > 0) _repo.DeleteRange(redesSociais);

                _mapper.Map(model, evento);

                _repo.Update(evento);

                if (await _repo.SaveChangesAsync())
                {
                    return Created($"/api/evento/{evento.Id}", _mapper.Map<EventoDto>(evento));
                }
            }
            catch (System.Exception ex)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, $"Banco de dados falhou.{ex.Message}");
            }
            return BadRequest();
        }

        [HttpDelete("{EventoId}")]
        public async Task<IActionResult> Delete(int EventoId)
        {
            try
            {
                var evento = await _repo.GetEventoAsyncById(EventoId, false);
                if (evento == null) return NotFound();

                _repo.Delete(evento);

                if (await _repo.SaveChangesAsync())
                {
                    return Ok();
                }
            }
            catch (System.Exception)
            {
                return this.StatusCode(StatusCodes.Status500InternalServerError, "Banco de dados falhou.");
            }
            return BadRequest();
        }
    }
}