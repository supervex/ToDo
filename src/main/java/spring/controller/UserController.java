package spring.controller;

import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import spring.dto.user.UserLoginRequest;
import spring.dto.user.UserLoginResponse;

import spring.dto.user.UserRegisterRequest;
import spring.dto.user.UserRegisterResponse;
import spring.service.UserService;


@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public UserLoginResponse login(
            @RequestBody UserLoginRequest request,
            HttpSession session
    ) {
        log.info("start for login payload: {}", request);
        return userService.login(request, session);
    }

    @PostMapping("/logout")
    public void logout(HttpSession session) {
        userService.logout(session);
    }

    @GetMapping("/me")
    public String whoAmI(HttpSession session) {
        Long userId = (Long) session.getAttribute("USER_ID");

        if (userId == null) {
            return "Non loggato";
        }

        return "User ID: " + userId;
    }

    @PostMapping("/register")
    public UserRegisterResponse register(
            @RequestBody UserRegisterRequest request
    ) {
        log.info("start for register payload: {}", request);
        return userService.register(request);
    }

}
