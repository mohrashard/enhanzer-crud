using EnhanzerBookApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace EnhanzerBookApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private static readonly List<Book> _books = new()
        {
            new Book 
            { 
                Id = 1, 
                Title = "The Pragmatic Programmer", 
                Author = "Andrew Hunt and David Thomas", 
                Isbn = "978-0201616224", 
                PublicationDate = new DateTime(1999, 10, 20) 
            },
            new Book 
            { 
                Id = 2, 
                Title = "Clean Code", 
                Author = "Robert C. Martin", 
                Isbn = "978-0132350884", 
                PublicationDate = new DateTime(2008, 8, 1) 
            }
        };

        [HttpGet]
        public ActionResult<IEnumerable<Book>> Get()
        {
            return Ok(_books);
        }

        [HttpGet("{id}")]
        public ActionResult<Book> Get(int id)
        {
            var book = _books.FirstOrDefault(b => b.Id == id);
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book);
        }

        [HttpPost]
        public ActionResult<Book> Post([FromBody] Book newBook)
        {
            newBook.Id = _books.Any() ? _books.Max(b => b.Id) + 1 : 1;
            _books.Add(newBook);
            
            return CreatedAtAction(nameof(Get), new { id = newBook.Id }, newBook);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Book updatedBook)
        {
            var existingBook = _books.FirstOrDefault(b => b.Id == id);
            if (existingBook == null)
            {
                return NotFound();
            }

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Isbn = updatedBook.Isbn;
            existingBook.PublicationDate = updatedBook.PublicationDate;

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var book = _books.FirstOrDefault(b => b.Id == id);
            if (book == null)
            {
                return NotFound();
            }

            _books.Remove(book);
            return NoContent();
        }
    }
}
