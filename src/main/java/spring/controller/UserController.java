package spring.controller;

import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import spring.dto.user.UserLoginRequest;
import spring.dto.user.UserLoginResponse;

import spring.dto.user.UserRegisterRequest;
import spring.dto.user.UserRegisterResponse;
import spring.service.UserService;

import java.util.Map;


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

    @PostMapping("/register")
    public UserRegisterResponse register(
            @RequestBody UserRegisterRequest request, HttpSession session
    ) {
        log.info("start for register payload: {}", request);
        return userService.register(request, session);
    }

    @GetMapping("/me")
    public ResponseEntity<?> whoAmI(HttpSession session) {
        Long userId = (Long) session.getAttribute("USER_ID");
        String username = (String) session.getAttribute("USERNAME");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("logged", false));
        }
        return ResponseEntity.ok(Map.of("logged", true, "userId", userId, "username", username));
    }

}
