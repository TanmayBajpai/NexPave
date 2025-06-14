package com.example.nexpave.Services;

import com.example.nexpave.Entities.Report;
import com.example.nexpave.Entities.ReportRequest;
import com.example.nexpave.Repositories.ReportRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import static com.example.nexpave.enums.Status.ACTIVE;

@Service
public class CreateReportService {

    private final RestTemplate restTemplate;
    private final GetTrafficService getTrafficService;
    private final ReportRepository reportRepository;

    @Value("${fastapi.url}")
    private String fastApiUrl;

    public static String capitalizeFirstLetter(String input) {
        if (input == null || input.isEmpty()) return input;
        String res = input.trim();
        return res.substring(0, 1).toUpperCase() + res.substring(1);
    }

    public CreateReportService(RestTemplate restTemplate, GetTrafficService getTrafficService, ReportRepository reportRepository) {
        this.restTemplate = restTemplate;
        this.getTrafficService = getTrafficService;
        this.reportRepository = reportRepository;
    }

    public Report createReport(ReportRequest reportRequest) {
        String size;
        int numberOfPotholes;
        String severity;
        int bounty;

        try {
            // Prepare the image as a resource
            Resource imageResource = new ByteArrayResource(reportRequest.getPotholeImage().getBytes()) {
                @Override
                public String getFilename() {
                    return reportRequest.getPotholeImage().getOriginalFilename();
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", imageResource);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    fastApiUrl + "/predict",
                    requestEntity,
                    Map.class
            );

            size = capitalizeFirstLetter((String) response.getBody().get("pothole_type"));
            numberOfPotholes = (int) response.getBody().get("count");

        } catch (IOException e) {
            throw new RuntimeException("Failed to read image file", e);
        }

        Report report = new Report();

        String fileName = UUID.randomUUID().toString() + "_" + reportRequest.getPotholeImage().getOriginalFilename();
        String uploadDir = System.getProperty("user.dir") + "/uploads/";
        String filePath = uploadDir + fileName;

        try {
            java.io.File dir = new java.io.File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            java.io.File imageFile = new java.io.File(filePath);
            reportRequest.getPotholeImage().transferTo(imageFile);

            // ✅ Serve this image via static Spring path
            report.setImageUrl("http://localhost:8080/uploads/" + fileName);

        } catch (IOException e) {
            throw new RuntimeException("Failed to store image", e);
        }

        report.setId(UUID.randomUUID());
        report.setSize(size);
        report.setLocation(reportRequest.getLocation());
        report.setLatitude(reportRequest.getLatitude());
        report.setLongitude(reportRequest.getLongitude());
        report.setDescription(reportRequest.getDescription());
        report.setPotholes(numberOfPotholes);
        report.setStatus(ACTIVE);

        String traffic = capitalizeFirstLetter(
                getTrafficService.getTraffic(reportRequest.getLatitude(), reportRequest.getLongitude())
        );

        report.setTrafficFlow(traffic);

        if (traffic.equals("High") || size.equals("High")) {
            severity = "High";
        } else if (traffic.equals("Medium") || size.equals("Medium")) {
            severity = "Medium";
        } else {
            severity = "Low";
        }

        report.setSeverity(severity);

        bounty = switch (severity) {
            case "High" -> 2000;
            case "Medium" -> 1500;
            default -> 1000;
        };
        bounty *= numberOfPotholes;
        report.setBounty(bounty);

        reportRepository.save(report);

        return report;
    }
}
