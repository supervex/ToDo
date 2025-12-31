package spring.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api")
public class ProvaApi {

    @GetMapping("/prova")
    public String prova() {
        return "Ciao dudins <3!\"";
    }
    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping("/t")
    public String todo(){
        return "todo";
    }

    @GetMapping("/diario")
    public String diario(){
        return "diario";
    }

    @GetMapping("/siti")
    public String siti(){
        return "siti";
    }

    @GetMapping("/giochi")
    public String giochi(){
        return "giochi";
    }
}
