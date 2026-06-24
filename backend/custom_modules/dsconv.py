import torch.nn as nn

class DSConv(nn.Module):
    def __init__(self, c1, c2, k=3, s=1):
        super().__init__()
        self.offset_conv = nn.Conv2d(c1, 2 * k * k, kernel_size=3, padding=1)
        self.conv = nn.Conv2d(c1, c2, kernel_size=k, stride=s, padding=k // 2, bias=False)
        self.bn = nn.BatchNorm2d(c2)
        self.act = nn.SiLU()

    def forward(self, x):
        offset = self.offset_conv(x)
        x = self.conv(x)
        return self.act(self.bn(x))
