package spring.service;

import jakarta.servlet.http.HttpSession;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import spring.dto.user.UserLoginRequest;
import spring.dto.user.UserLoginResponse;
import spring.dto.user.UserRegisterRequest;
import spring.dto.user.UserRegisterResponse;
import spring.model.User;
import spring.repository.UserRepository;

import java.util.Optional;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserLoginResponse login(
            UserLoginRequest request,
            HttpSession session
    ) {

        UserLoginResponse response = new UserLoginResponse();

        Optional<User> userOpt =
                userRepository.findByUserName(request.getUserName());

        if (userOpt.isEmpty()) {
            response.setSuccess(false);
            response.setMessage("Utente non trovato");
            log.error("user non trovato : {}", request.getUserName());
            return response;
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            response.setSuccess(false);
            response.setMessage("Password errata");
            log.error("password errata : {}", request.getPassword());
            return response;
        }

        session.setAttribute("USER_ID", user.getUserId());
        session.setAttribute("USERNAME", user.getUserName());

        response.setSuccess(true);
        response.setMessage("Login effettuato con successo");
        log.info("end for login payload: {}", request);
        return response;
    }

    public void logout(HttpSession session) {
        session.invalidate();
    }

    public UserRegisterResponse register(UserRegisterRequest request, HttpSession session) {

        UserRegisterResponse response = new UserRegisterResponse();

        if (request.getUserName() == null || request.getUserName().isBlank()
                || request.getPassword() == null || request.getPassword().isBlank()
                || request.getEmail() == null || request.getEmail().isBlank()) {

            response.setSuccess(false);
            response.setMessage("Tutti i campi sono obbligatori");
            log.error("Tutti i campi sono obbligatori : {}", request);
            return response;
        }

        if (userRepository.existsByUserName(request.getUserName())) {
            response.setSuccess(false);
            response.setMessage("Username già in uso");
            log.error("Username già in uso : {}", request.getUserName());
            return response;
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            response.setSuccess(false);
            response.setMessage("Email già registrata");
            log.error("Email già in uso : {}", request.getEmail());
            return response;
        }

        String hashedPassword =
                passwordEncoder.encode(request.getPassword());

        User user = new User();
        user.setUserName(request.getUserName());
        user.setEmail(request.getEmail());
        user.setPassword(hashedPassword);

        userRepository.save(user);
        session.setAttribute("USER_ID", user.getUserId());
        session.setAttribute("USERNAME", user.getUserName());
        response.setSuccess(true);
        response.setMessage("Registrazione completata con successo");
        log.info("end for register payload: {}", request);
        return response;
    }
}
