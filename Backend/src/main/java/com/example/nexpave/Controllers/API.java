package com.example.nexpave.Controllers;

import com.example.nexpave.Entities.Contractor;
import com.example.nexpave.Entities.Report;
import com.example.nexpave.Entities.ReportRequest;
import com.example.nexpave.Repositories.ReportRepository;
import com.example.nexpave.Repositories.UserRepository;
import com.example.nexpave.Services.CreateReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.example.nexpave.enums.Status.CLAIMED;
import static com.example.nexpave.enums.Status.COMPLETED;

@RestController
@RequestMapping("/api")
public class API {

    private final CreateReportService createReportService;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public API(CreateReportService createReportService, ReportRepository reportRepository, UserRepository userRepository) {
        this.createReportService = createReportService;
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/check-auth")
    public ResponseEntity<String> checkAuth(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            return ResponseEntity.ok("Authenticated");
        } else {
            return ResponseEntity.status(401).body("Not authenticated");
        }
    }

    @PostMapping("/post-report")
    public Report postReport(
            @RequestParam String location,
            @RequestParam String latitude,
            @RequestParam String longitude,
            @RequestParam(value="image") MultipartFile potholeImage,
            @RequestParam String description
            ) {
        ReportRequest reportRequest = new ReportRequest();

        reportRequest.setDescription(description);
        reportRequest.setLocation(location);
        reportRequest.setLatitude(latitude);
        reportRequest.setLongitude(longitude);
        reportRequest.setPotholeImage(potholeImage);

        Report report = createReportService.createReport(reportRequest);

        return report;
    }

    @PostMapping("/get-reports")
    public List<Report> getReports() {
        List<Report> list = reportRepository.findAll();

        list.removeIf(report -> report.getStatus() == CLAIMED || report.getStatus() == COMPLETED);

        return list;
    }

    @PostMapping("/claim")
    public ResponseEntity<String> claimBounty(@RequestParam UUID reportId, @AuthenticationPrincipal UserDetails userDetails) {

        String username = userDetails.getUsername();

        Contractor contractor = userRepository.findByUsername(username);

        Optional<Report> reportOptional = reportRepository.findById(reportId);

        if (reportOptional.isPresent()) {
            Report report = reportOptional.get();

            report.setStatus(CLAIMED);
            report.setContractor(contractor);
            reportRepository.save(report);
        }

        return ResponseEntity
                .status(HttpStatus.OK)
                .body("Job Claimed Successfully!");
    }

    @PostMapping("/verify")
    public void verify(@RequestParam String reportId) {

        UUID id = UUID.fromString(reportId);

        System.out.println(id);
        Optional<Report> reportOptional = reportRepository.findById(id);

        Report report = reportOptional.get();

        report.setStatus(COMPLETED);
        reportRepository.save(report);
    }

    @GetMapping("/get-mywork")
    public List<Report> getMyWork(@AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();

        Contractor contractor = userRepository.findByUsername(username);

        UUID contractorId = contractor.getId();

        List<Report> list = reportRepository.findByContractor_Id(contractorId);

        list.removeIf(report -> report.getStatus() == COMPLETED);

        return list;
    }

    @GetMapping("/get-completedWork")
    public List<Report> getCompletedWork() {
        List<Report> list = reportRepository.findAll();

        list.removeIf(report -> report.getStatus() != COMPLETED);

        return list;
    }

    @GetMapping("/get-upi")
    public ResponseEntity<String> getUpi(@RequestParam String contractorId) {
        Optional<Contractor> userOptional = userRepository.findById(UUID.fromString(contractorId));

        if (userOptional.isPresent()) {
            Contractor contractor = userOptional.get();

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(contractor.getUpiId());
        }

        return null;
    }

    @GetMapping("/get-upi-qr")
    public ResponseEntity<String> getUpiQr(@RequestParam String contractorId, @RequestParam int amount) {
        Optional<Contractor> userOptional = userRepository.findById(UUID.fromString(contractorId));
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Contractor not found");
        }

        Contractor contractor = userOptional.get();
        String upiId = contractor.getUpiId();

        // Construct UPI payment string
        String upiUri = "upi://pay?pa=" + upiId + "&pn=NexPave&am=" + amount + "&cu=INR";

        // Use a public QR generator (e.g. QRServer)
        String qrImageUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=" +
                java.net.URLEncoder.encode(upiUri, java.nio.charset.StandardCharsets.UTF_8);

        return ResponseEntity.ok(qrImageUrl);
    }


}
