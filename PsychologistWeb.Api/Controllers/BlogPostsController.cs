using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PsychologistWeb.Api.Data;
using PsychologistWeb.Api.Models;

namespace PsychologistWeb.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogPostsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BlogPostsController(AppDbContext context)
        {
            _context = context;
        }

        // HERKES - Yayındaki blogları getir
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var blogs = await _context.BlogPosts
                .Where(x => x.IsPublished)
                .OrderByDescending(x => x.CreatedDate)
                .ToListAsync();

            return Ok(blogs);
        }

        // HERKES - Slug ile blog detayını getir
        [HttpGet("slug/{slug}")]
        public async Task<IActionResult> GetBySlug(string slug)
        {
            var blog = await _context.BlogPosts
                .FirstOrDefaultAsync(x =>
                    x.Slug == slug &&
                    x.IsPublished);

            if (blog == null)
            {
                return NotFound();
            }

            return Ok(blog);
        }

        // ADMIN - Yayında olmayanlar dahil bütün blogları getir
        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public async Task<IActionResult> GetAllForAdmin()
        {
            var blogs = await _context.BlogPosts
                .OrderByDescending(x => x.CreatedDate)
                .ToListAsync();

            return Ok(blogs);
        }

        // ADMIN - ID ile getir
        [Authorize(Roles = "Admin")]
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var blog = await _context.BlogPosts.FindAsync(id);

            if (blog == null)
            {
                return NotFound();
            }

            return Ok(blog);
        }

        // ADMIN - Yeni blog ekle
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(BlogPost blogPost)
        {
            blogPost.CreatedDate = DateTime.UtcNow;

            _context.BlogPosts.Add(blogPost);

            await _context.SaveChangesAsync();

            return Ok(blogPost);
        }

        // ADMIN - Blog güncelle
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            BlogPost blogPost)
        {
            var blog = await _context.BlogPosts.FindAsync(id);

            if (blog == null)
            {
                return NotFound();
            }

            blog.Title = blogPost.Title;
            blog.Summary = blogPost.Summary;
            blog.Content = blogPost.Content;
            blog.Slug = blogPost.Slug;
            blog.ImageUrl = blogPost.ImageUrl;
            blog.IsPublished = blogPost.IsPublished;
            blog.UpdatedDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(blog);
        }

        // ADMIN - Blog sil
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var blog = await _context.BlogPosts.FindAsync(id);

            if (blog == null)
            {
                return NotFound();
            }

            _context.BlogPosts.Remove(blog);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}