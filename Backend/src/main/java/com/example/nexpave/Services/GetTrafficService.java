package com.example.nexpave.Services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;

@Service
public class GetTrafficService {

    @Value("${google.maps.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getTraffic(String latitude, String longitude) {
        try {
            // Parse latitude and longitude and add a small offset to simulate nearby destination
            double lat = Double.parseDouble(latitude);
            double lon = Double.parseDouble(longitude);

            double offsetLat = lat + 0.002; // ~200 meters
            double offsetLon = lon + 0.002;

            String origin = lat + "," + lon;
            String destination = offsetLat + "," + offsetLon;

            String url = "https://maps.googleapis.com/maps/api/distancematrix/json?" +
                    "origins=" + origin +
                    "&destinations=" + destination +
                    "&departure_time=now" +
                    "&traffic_model=best_guess" +
                    "&key=" + apiKey;

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JSONObject json = new JSONObject(response.getBody());

            JSONObject element = json.getJSONArray("rows")
                    .getJSONObject(0)
                    .getJSONArray("elements")
                    .getJSONObject(0);

            String status = element.getString("status");
            if (!status.equals("OK")) {
                return "Unknown";
            }

            int durationInTraffic = element
                    .getJSONObject("duration_in_traffic")
                    .getInt("value");

            int normalDuration = element
                    .getJSONObject("duration")
                    .getInt("value");

            double ratio = (double) durationInTraffic / normalDuration;

            if (ratio <= 1.1) return "Low";
            else if (ratio <= 1.5) return "Medium";
            else return "High";

        } catch (Exception e) {
            e.printStackTrace();
            return "Unknown";
        }
    }
}
