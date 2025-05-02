using Microsoft.AspNetCore.Identity;

public class ApplicationUser : IdentityUser
{
    //Agregamos Campos Extras
    public string? NombreCompleto { get; set; }
}